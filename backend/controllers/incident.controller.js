import prisma from "../lib/prisma.js";
import { sendMail } from "../utils/mail.js";

export const getIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      include: {
        user: {
          select: {
            fname: true, 
            lname: true, 
          },
        },
      },
    });
    res.status(200).json(incidents);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get incidents.' });
  }
}


export const getIncident = async (req, res) => {
    const id = req.params.id;
    try {
        const incident = await prisma.incident.findUnique({
            where: {id: id},
            include: {
                incidentDetail: true,
                user: {
                    select: {
                        fname: true,
                        lname: true,
                        avatar: true
                    }
                }
            }
        });
        res.status(200).json(incident);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to get incident.' });
    }
};


export const addIncident = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.userId;
    try {
        const newIncident = await prisma.incident.create({
            data: {
                ...body.incidentData,
                userId: tokenUserId,
                incidentDetail: {
                    create: body.incidentDetail,
                }
            }
        });

        
        const admin= await prisma.admin.findMany({
          select:{email:true}
        })

        const adminMail= admin.map((adminmail=> adminmail.email))

        sendMail({
          to:adminMail,
          subject: "New Incident Reported",
          html: `<p> A new Incident has been reported: </p
                  <p><strong> ${body.incidentData.title}</strong>
                  <p>${body.incidentData.description}</p>`
                
        })
        res.status(200).json(newIncident);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to report incident' });
    }
};


export const updateIncident = async (req, res) => {
  try {
    res.status(200).json({ message: ' ' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete incident' });
  }
};


export const deleteIncident = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;

    console.log(id)

    try {
        const incident = await prisma.incident.findUnique({
            where: {id: id}
        })

        if(incident.userId !== tokenUserId) {
            return res.status(403).json({ message: 'Not Authorized.' });
        }

        await prisma.incident.delete({
            where: {id: id}
        })
        

        res.status(200).json({ message: 'Incident deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to delete incident' });
    }
};

export const updateIncidentMailSent = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedIncident = await prisma.incident.update({
      where: { id: id },
      data: { sentEmail: true },
    });

    res.status(200).json(updatedIncident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update incident.' });
  }
};

export const approveIncident = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedIncident = await prisma.incident.update({
      where: { id: id },
      data: { isApproved: "approved" },
    });

    res.status(200).json(updatedIncident); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve incident.' });
  }
};

export const rejectIncident = async (req, res) => {
  const id = req.params.id; 
  try {
    const rejectIncident = await prisma.incident.update({
      where: { id: id },
      data: { isApproved: 'rejected' },
    });

    res.status(200).json(rejectIncident); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject incident.' });
  }
};


export const deleteIncidentByAdmin = async (req, res) => {
  const id = req.params.id;

  try {
    await prisma.incident.delete({
      where: { id: id },
    });

    res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to delete incident' });
  }
};

export const addAnonymousIncident = async (req, res) => {
  const { incidentData, incidentDetail } = req.body;

  
  const {
    deaths,       
    casualties,   
    ...cleanIncidentData
  } = incidentData;

  try {
    const newIncident = await prisma.incident.create({
      data: {
        ...cleanIncidentData,
        userId: null, 
        incidentDetail: {
          create: incidentDetail, 
        },
      },
    });

    const admin = await prisma.admin.findMany({ select: { email: true } });
    const adminMail = admin.map(admin => admin.email);

    sendMail({
      to: adminMail,
      subject: "🚨 Anonymous Incident Reported",
      html: `
        <p><strong>Title:</strong> ${cleanIncidentData.title}</p>
        <p><strong>Description:</strong></p>
        ${cleanIncidentData.description}
      `,
    });

    res.status(200).json(newIncident);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to report incident anonymously' });
  }
};
