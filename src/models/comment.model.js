const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        }
    },
    {
        timestamps: true
    }
)

const commentModel = mongoose.model("comment", commentSchema)

module.exports = { commentModel }