import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt, { hash } from 'bcryptjs';
import axios from 'axios';

export const signUpUser = async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({ success: false, message: "Data not found" })
    }

    try {

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.json({ success: false, message: "user already exists" })
        }

        const hashedpassword = await bcrypt.hash(password, 10)

        const userModel = new User({ username, email, password: hashedpassword })
        await userModel.save()

        const token = jwt.sign({ id: userModel._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        // Send welcome email via Brevo API
        try {
            await axios.post(
                "https://api.brevo.com/v3/smtp/email",
                {
                    sender: { email: "luffytaro2656@gmail.com", name: "CashFlow App" },
                    to: [{ email }],
                    subject: "Welcome to Cashflow",
                    textContent: `Welcome ${username} to Cashflow expense tracker! Your email: ${email}`,
                },
                {
                    headers: {
                        "api-key": process.env.BREVO_API_KEY,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Welcome email sent via Brevo API");
        } catch (error) {
            return res.json({ success: false, message: error.message })
        }

        return res.json({ success: true, message: "user created successfully" })

    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const loginUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "email or password required" })
    }

    try {

        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid user" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ success: true, token:token, message: "logged in successfully" })

    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }

}


// to create otp and send to the user's email
export const createOtp = async (req, res) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId)

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpiresAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        try {
            await axios.post("https://api.brevo.com/v3/smtp/email", {
                sender: { email: "luffytaro2656@gmail.com", name: "CashFlow App" },
                to: [{ email: user.email }],
                subject: "verification OTP",
                textContent: `your verification OTP to verify your account to proceed : ${otp}`
            },
                {
                    headers: {
                        "api-key": process.env.BREVO_API_KEY,
                        "Content-Type": "application/json",
                    }
                }
            )
        }
        catch (error) {
            return res.json({ success: false, message: error.message })
        }

        return res.json({ success: true, message: "verification OTP sent successfully" })

    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
};

// to verify the otp send to email
export const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const userId = req.user?.id;

        if (!userId || !otp) {
            return res.json({ success: false, messsage: "user or otp not found" })
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "OTP is not valid" })
        }

        if (user.verifyOtpExpiresAt < Date.now()) {
            return res.json({ success: false, message: "OTP expires" })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiresAt = 0;

        await user.save();

        return res.json({ success: true, message: "Account is verified" })

    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// to verify the password resetotp send to email
export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.json({ success: false, messsage: "email or otp not found" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "OTP is not valid" })
        }

        if (user.resetOtpExpiresAt < Date.now()) {
            return res.json({ success: false, message: "OTP expires" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        user.resetOtp = '';
        user.resetOtpExpiresAt = 0;

        await user.save();

        return res.json({ success: true, message: "OTP is verified" })

    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// to check is user authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// to send passsword reset otp
export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "email not found" })
    }

    try {

        const user = await User.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        if (!user.isAccountVerified) {
            return res.json({ success: false, message: "Account is not verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        try {
            await axios.post("https://api.brevo.com/v3/smtp/email", {
                sender: { email: "luffytaro2656@gmail.com", name: "CashFlow App" },
                to: [{ email: user.email }],
                subject: "reset password OTP",
                textContent: `your verification OTP to reset your password ${otp} is here`
            },
                {
                    headers: {
                        "api-key": process.env.BREVO_API_KEY,
                        "Content-Type": "application/json",
                    }
                }
            )
        }
        catch (error) {
            return res.json({ success: false, message: error.message })
        }

        return res.json({ success: true, message: "password reset OTP sent successfully" })

    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }

}

//to reset password
export const resetPassword = async (req, res) => {
    const { newPassword, cPassword } = req.body;

    const userId = req.user?.id;

    if (!newPassword || !cPassword) {
        return res.json({ success: false, message: "new or confirm password not available" })
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        if (newPassword !== cPassword) {
            return res.json({ success: false, message: "password doesn't match" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()

        return res.json({ success: true, message: "password reset successfully" })


    }
    catch (error) {
        res.json({ success: false, message: error.message })
    }
}