import express from 'express';

import { signUpUser, loginUser, createOtp, verifyOtp, isAuthenticated, sendResetOtp, resetPassword, verifyResetOtp } from '../controllers/authController.js'
import tokenDecoder from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post("/signUp", signUpUser);

router.post("/login", loginUser);

router.post("/send-verify-otp", tokenDecoder, createOtp)

router.post("/verifyotp", tokenDecoder, verifyOtp)

router.post("/isauth", tokenDecoder, isAuthenticated)

router.post("/send-reset-otp", sendResetOtp)

router.post("/reset-password", tokenDecoder, resetPassword)

router.post("/verify-reset-otp", verifyResetOtp)

export default router;