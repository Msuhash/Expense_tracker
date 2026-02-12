import express from 'express';
import tokenDecoder from '../middleware/authMiddleWare.js';
import {userData, updatePassword, updateUsername, logout} from '../controllers/userController.js'

const router = express.Router();

router.get("/data", tokenDecoder, userData) // get user data for profile
router.put("/update-username", tokenDecoder, updateUsername)
router.put("/update-password", tokenDecoder, updatePassword)
router.post("/logout", tokenDecoder, logout)

export default router;