import prisma from '../lib/prisma.js';

export const getEmails = async (req, res) => {
  
  try {
    const emails = await prisma.email.findMany({
      include: {
        sentBy: {
          select: {
            username: true
          },
        },
        
      },
    });
    res.status(200).json(emails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get emails.' });
  }
};
export const addEmail = async (req, res) => {
  const { title, message, location, incidentId } = req.body;
  const tokenAdminId = req.adminId;

  console.log(tokenAdminId)
  try {
    // const admin = await prisma.admin.findUnique({
    //   where: { id: tokenAdminId }
    // });

    // console.log(admin)

    // if (!admin) {
    //   return res.status(400).json({ message: 'Invalid admin ID' });
    // }

    const users = await prisma.user.findMany();
    const numberOfUsers = users.length;

    const newEmail = await prisma.email.create({
      data: {
        title,
        message,
        userCount: numberOfUsers,
        location,
        incidentId,
        sentById: tokenAdminId, 
      },
    });
    

    console.log('Email created successfully');
    res.status(200).json(newEmail);
  } catch (error) {
    console.error('Error adding email:', error);
    res.status(500).json({ message: 'Failed to add Email' });
  }
};


export const getMailsUser= async(req, res)=>{

  console.log(req.adminId)
  // console.log(req.id)

  // const mailId= await prisma.email.findMany({
  //         select:{
  //           sentById:true
  //         }
  // })

  // const mailSender= await prisma.user.findFirst({
  //   where:{
  //     id:mailId.map((userId)=>{
  //       userId.sentById
  //     })
  //   }
  // })

  // res.status(200).json(mailId)
  // res.status(200).json(mailSender)
  // const emails = await prisma.email.findMany({
  //   include: {
  //     sentBy: {
  //       select: {
  //         username: true
  //       },
  //     },
      
  //   },
  // });
  // res.status(200).json(emails);

}