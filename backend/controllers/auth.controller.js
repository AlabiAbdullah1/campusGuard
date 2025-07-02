import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
import { sendMail } from "../utils/mail.js";

export const registerUser = async (req, res) => {
    const { fname, lname, email, password, address, province, district, city, nic, mobile, uploadedAvatar} = req.body;
    const verificationToken= uuidv4();
    const isVerified = false;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {

     
        const newUser = await prisma.user.create({ 
            data: {
                fname,
                lname,
                email,
                password: hashedPassword,
                mobile,
                avatar: uploadedAvatar,
                verificationToken,
                isVerified,
                
            },
        });

         sendMail({
        to:email,
        subject:"Verify your email address",
        html: `<h1>Verify your email address</h1>
               <p>This is your verification token: <strong>${verificationToken}</strong></p>
               <p>Click <a href="http://localhost:5173/verify/${verificationToken}">here</a> to verify your email address.</p>`
      })
        res.status(201).json({message: "User registered successfully."});
    } catch(error) {
        console.log(error);
        res.status(500).json({message: "Failed to register user."})
    }
    
}


export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Find user by verificationToken (assuming it's unique, else use findFirst)
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired verification link" });
    }

    // Update user verification status and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: ""
      }
    });

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const signinUser = async (req, res) => {
    const {email, password} = req.body;

   

    try {


        const user = await prisma.user.findUnique({
            where: {email: email}
        })

        if(!user) return res.status(401).json({ message: 'Invalid credentials.' });

        const verifiedUser = await prisma.user.findUnique({
        where: {email: email},
        select: {isVerified: true}
    })

    if(!verifiedUser.isVerified){
      return res.status(401).json({ message: 'Please check your inbox and verify your email address.' });
    }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Check your password again.' });

        const age = 1000 * 60 * 60 * 24 * 7;

         const { password: userPassword, ...userInfo } = user;

        const token = jwt.sign({
            id:user.id,
            isAdmin: false
            }, 
            process.env.JWT_SECRET_KEY,
            {expiresIn: age}
        )

        res
          .cookie('token', token, {
            httpOnly: true,
            maxAge: age,
            // secure: true
          })
          .status(200)
          .json({
            userInfo,
            token
          });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to login.' });
    }
}


export const logoutUser = (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logout successful."})
}


//Admin Side
export const registerAdmin = async (req, res) => {
  const tokenAdminId = req.adminId;

  const {
    fullName,
    username,
    password,
    email,
    mobile,
    avatar,
    department,
    isMaster
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if the requesting admin is a master admin
    const requestingAdmin = await prisma.admin.findUnique({
      where: { id: tokenAdminId },
      select: { isMaster: true },
    });

    if (!requestingAdmin.isMaster) {
      return res.status(403).json({
        message: 'You are not authorized to Register Admins.',
      });
    }

    const newAdmin = await prisma.admin.create({
      data: {
        fullName,
        username,
        password: hashedPassword,
        email,
        mobile,
        avatar,
        department,
        isMaster,
      },
    });

    console.log(newAdmin);
    res.status(201).json({ message: 'Admin registered successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to register Admin.' });
  }
};

export const signinAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { username: username },
    });

    if (!admin) return res.status(401).json({ message: 'Invalid credentials.' });

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: 'Check your password again.' });

    const age = 1000 * 60 * 60 * 24;

    const { password: adminPassword, ...adminInfo } = admin;

    const adminToken = jwt.sign(
      {
        adminId: admin.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    res
      .cookie('adminToken', adminToken, {
        httpOnly: true,
        maxAge: age,
        // secure: true
      })
      .status(200)
      .json(adminInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to login.' });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie('adminToken').status(200).json({ message: 'Admin Logout successful.' });
};