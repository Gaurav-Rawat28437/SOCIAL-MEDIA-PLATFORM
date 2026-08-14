const express = require("express")
const router = express.Router()
require("dotenv").config()

const { Resend } = require("resend")
const resend = new Resend(process.env.RESEND_API)
const validator = require("validator")


const { otpModel } = require("../models/otp.model")
const { verifiedMailModel } = require("../models/verified.model")

router.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body



        const otp = Math.floor(100000 + Math.random() * 900000)

        if (!email) {
            throw new Error("email not received from frontend")
        }

        if (!validator.isEmail(email)) {
            throw new Error("please enter a valid email....")
        }

        const createOtp = await otpModel.insertOne({
            email,
            otp
        })

        if (!createOtp) {
            throw new Error("opt not save in mongo")
        }

        await resend.emails.send({
            from: "Gaurav <onboarding@resend.dev>",
            subject: "Your OTP for Email Verification",
            to: email,
            html: ` 
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">

                    <h2 style="text-align: center; color: #111827; margin-bottom: 10px;">
                        Verify Your Email
                    </h2>

                    <p style="font-size: 16px; color: #4b5563;">
                        Hello,
                    </p>

                    <p style="font-size: 16px; color: #4b5563; line-height: 1.6;">
                        Welcome to <strong>Social App</strong>! Please use the verification code below to verify your email address.
                    </p>

                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; padding: 15px 25px; background-color: #f3f4f6; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb;">
                            ${otp}
                        </span>
                    </div>

                    <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
                        This verification code will expire in <strong>2 minutes</strong>.
                        Please do not share this code with anyone.
                    </p>

                    <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
                        If you did not request this verification code, you can safely ignore this email.
                    </p>

                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">

                    <p style="text-align: center; font-size: 12px; color: #9ca3af;">
                        © 2026 Social App. All rights reserved.
                    </p>

                </div>
                    `
        })


        res.status(201).json({
            success: true,
            msg: "otp is send",
        })
    }
    catch (error) {
        res.status(400).json({
            msg: error.message,
            error: error
        })
    }
})

router.post("/verify-otp", async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            throw new Error("email or otp not received from frontend")
        }

        if (!validator.isEmail(email)) {
            throw new Error("please enter a valid email....")
        }

        const foundOtp = await otpModel.findOne({ email, otp })

        if (!foundOtp) {
            throw new Error("Invalid OTP,please try again...")
        }

        const expiryTime = new Date(
            foundOtp.expireAt.getTime() + 120 * 1000
        )
        if (expiryTime < new Date()) {
            await otpModel.deleteOne({
                _id: foundOtp._id
            });

            throw new Error("OTP has expired, please request a new OTP")
        }

        await verifiedMailModel.create({
            email
        })

        await otpModel.deleteOne({
            _id: foundOtp._id
        })

        return res.status(200).json({
            success: true,
            msg: "Email verified successfully"
        })


    }
    catch (error) {
        res.status(400).json({
            msg: error.message,
            error: error
        })
    }
})


module.exports = {
    authRouter: router
}