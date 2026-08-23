const rateLimit = require("express-rate-limit")

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,            
    message: {
        success: false,
        msg: "Too many OTP requests. Please try again later."
    }
})

const verifyLimiter=rateLimit({
    windowMs:30*60*1000,
    max:5,
    message: {
        success: false,
        msg: "Too many OTP attempts. Please try again later."
    }
})

const loginLimiter=rateLimit({
    windowMs:30*60*1000,
    max:5,
    message: {
        success: false,
        msg: "Too many login requests. Please try again later."
    }
})


module.exports = {
    otpLimiter,
    verifyLimiter,
    loginLimiter
}