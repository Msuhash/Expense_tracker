import express from "express";
import { exportData } from "../controllers/exportController.js";
import tokenDecoder from "../middleware/authMiddleWare.js";

const Router = express.Router()

Router.post("/generate",tokenDecoder,exportData)

export default Router

