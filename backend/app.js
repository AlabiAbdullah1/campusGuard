import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import incidentRoute from './routes/incident.route.js';
import emailRoute from "./routes/email.route.js";
import adminRoute from "./routes/admin.route.js";
import anonymousRoute from "./routes/anonymous.route.js";

dotenv.config();
const port = process.env.PORT||8000;
const app = express()

const corsOptions = {
    // origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}
app.use(cors(corsOptions))
// app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/incidents", incidentRoute);
app.use('/api/emails', emailRoute);
app.use('/api/admins', adminRoute);
app.use("/api/anonymous", anonymousRoute)

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})