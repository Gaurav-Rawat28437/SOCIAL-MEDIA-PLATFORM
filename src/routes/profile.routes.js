const express = require("express")
const validator = require("validator")
const { userModel } = require("../models/User.model")
const { isLoggedIn } = require("../middleware/isLoggedIn.middleware")
const bcrypt = require("bcrypt")

const router = express.Router()


router.put("/completeProfile/:userId", isLoggedIn, async (req, res) => {

    try {
        const { firstName, lastName, dateOfBirth, gender, displayPicture, bio } = req.body
        const { userId } = req.params

        if (!firstName) throw new Error("firstName is not recieved from frontend")

        if (!lastName) throw new Error("lastName is not recieved from frontend")

        if (!dateOfBirth) throw new Error("dateOfBirth is not recieved from frontend")

        if (!gender) throw new Error("gender is not recieved from frontend")

        if (firstName.length < 2 || firstName.length > 15) throw new Error("firstName length should be 2 to 15")

        if (!["male", "female", "other"].includes(gender.toLowerCase())) throw new Error("gender should be male,female or other")


        if (!validator.isDate(dateOfBirth, {
            format: "DD/MM/YYYY",
            strictMode: true
        })) {
            throw new Error("Please enter a valid date in DD/MM/YYYY format")
        }

        const [day, month, year] = dateOfBirth.split("/").map(Number)

        const dobDate = new Date(year, month - 1, day)

        const today = new Date()

        today.setHours(0, 0, 0, 0)
        dobDate.setHours(0, 0, 0, 0)

        if (dobDate > today) {
            throw new Error("Date of birth cannot be greater than today")
        }

        const eighteenYearsAgo = new Date(
            today.getFullYear() - 18,
            today.getMonth(),
            today.getDate()
        )

        if (dobDate > eighteenYearsAgo) {
            throw new Error("user must be at least 18 years old")
        }

        const foundUser = await userModel.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            dateOfBirth,
            gender,
            displayPicture,
            bio,
            isCompletedProfile: true
        }, {
            returnDocument: "after",
            runValidators: true
        }).select("-_id firstName lastName email gender dateOfBirth displayPicture bio isCompletedProfile followers following posts")

        res.status(200).json({
            success: true,
            msg: "user profile is complete",
            data: foundUser

        })

    }
    catch (error) {
        res.status(404)
            .json({
                msg: error.message,
                error: error
            })
    }
})

router.patch("/update", isLoggedIn, async (req, res) => {
    try {
        if (req.body === undefined) throw new Error("nothing received form frontend,body is undefined")

        const {
            firstName,
            lastName,
            bio,
            displayPicture,
            username,
            gender
        } = req.body

        const foundUser = req.foundUser

        if (firstName !== undefined) {
            if (foundUser.firstName !== firstName ) {

                if(firstName.length<2 || firstName.length>15) throw new Error("please enter firstName in between character 2 to 15")
                
                foundUser.firstName = firstName
            }

        }

        if (lastName !== undefined) {
            if (foundUser.lastName !== lastName) {
                
                foundUser.lastName = lastName
            }

        }

        if (bio !== undefined) {
            if (foundUser.bio !== bio) {
                
                foundUser.bio = bio
            }

        }

        if (displayPicture !== undefined) {

            if(!validator.isURL(displayPicture)) throw new Error("please provide valide url of image")
            
            if (foundUser.displayPicture !== displayPicture) {
                foundUser.displayPicture = displayPicture
            }

        }

        if (username !== undefined) {
            if (foundUser.username !== username) {
                
                foundUser.username = username
            }

        }

        if (gender !== undefined) {

            if (gender === "") {
                throw new Error("gender cannot be empty")
            }

            const validGenders = ["male", "female", "other"]

            if (!validGenders.includes(gender.toLowerCase())) {
                throw new Error("gender should be male, female or other")
            }

            if (foundUser.gender !== gender.toLowerCase()) {
                foundUser.gender = gender.toLowerCase()
            }

        }


        await foundUser.save()

        res.status(200).json({
            success: true,
            msg: "User profile updated successfully",

            data: {
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                username: foundUser.username,
                email: foundUser.email,
                gender: foundUser.gender,
                dateOfBirth: foundUser.dateOfBirth,
                displayPicture: foundUser.displayPicture,
                bio: foundUser.bio,
                isCompletedProfile: foundUser.isCompletedProfile,
                followers: foundUser.followers,
                following: foundUser.following,
                posts: foundUser.posts
            }
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
            error: error
        })
    }
})


module.exports = {
    profileRouter: router
}