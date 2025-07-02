import express from 'express';
import { addAnonymousIncident } from '../controllers/incident.controller.js';

const anonymousRoute= express.Router();

anonymousRoute.post("/", addAnonymousIncident)

export default anonymousRoute;