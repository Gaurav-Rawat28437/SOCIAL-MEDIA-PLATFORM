const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ""
    },
    imgUrl: {
        type: String,
        default: ""
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true

    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },

    repostsCount: {
        type: Number,
        default: 0
    }

}, {
    timestamps: true
})

const postModel = mongoose.model("post", postSchema)

module.exports = {
    postModel
}