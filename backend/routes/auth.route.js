import express from 'express';
import { logoutUser, registerUser, signinUser, registerAdmin, signinAdmin, logoutAdmin, verifyEmail } from '../controllers/auth.controller.js';
import { verifyAdminToken } from '../middleware/verifyToken.js';

const userRoute = express.Router();

userRoute.post('/user/register', registerUser);
userRoute.post('/user/signin', signinUser);
userRoute.post('/user/logout', logoutUser);
userRoute.get("/user/verify/:token", verifyEmail)

userRoute.post('/admin/register',verifyAdminToken,registerAdmin);
userRoute.post('/admin/signin', signinAdmin);
userRoute.post('/admin/logout', logoutAdmin);

export default userRoute;