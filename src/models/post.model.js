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
    authorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true
        
    }

}, {
    timestamps: true
})

const postModel = mongoose.model("post", postSchema)

module.exports = {
    postModel
}