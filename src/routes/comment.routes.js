const express=require("express")
const router=express.Router()

const { postModel } = require("../models/post.model")
const { commentModel } = require("../models/comment.model")



router.post("/create/:postId", async (req, res) => {

    try {

        const userId = req.foundUser._id
        const { postId } = req.params
        const { content } = req.body

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                msg: "Comment cannot be empty"
            })
        }

        const post = await postModel.findById(postId)

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "Post not found"
            })
        }

        const comment = await commentModel.create({
            post: postId,
            user: userId,
            content: content.trim()
        })

        const updatedPost = await postModel.findByIdAndUpdate(
            postId,
            {
                $inc: {
                    commentsCount: 1
                }
            },
            {
                new: true
            }
        )

        return res.status(201).json({
            success: true,
            msg: "Comment added successfully",
            data: comment,
            commentsCount: updatedPost.commentsCount
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            msg: "Unable to add comment"
        })
    }
})


router.get("/getAllComment/:postId", async (req, res) => {

    try {

        const { postId } = req.params

        const post = await postModel.findById(postId)

        if (!post) {
            return res.status(404).json({
                success: false,
                msg: "Post not found"
            })
        }

        const comments = await commentModel
            .find({ post: postId })
            .populate(
                "user",
                "firstName lastName username displayPicture"
            )
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            data: comments,
            commentsCount: post.commentsCount
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            success: false,
            msg: "Unable to get comments"
        })
    }
})


router.delete("/delete/:commentId", async (req, res) => {
    try {
        const userId = req.foundUser._id
        const { commentId } = req.params

        const comment = await commentModel.findById(commentId)

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: "Comment not found"
            })
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                msg: "You can only delete your own comment"
            })
        }

        await commentModel.findByIdAndDelete(commentId)

        const updatedPost = await postModel.findByIdAndUpdate(
            comment.post,
            {
                $inc: {
                    commentsCount: -1
                }
            },
            {
                new: true
            }
        )

        return res.status(200).json({
            success: true,
            msg: "Comment deleted successfully",
            commentsCount: updatedPost.commentsCount
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            msg: "Unable to delete comment"
        })
    }
})


router.put("/edit/:commentId", async (req, res) => {
    try {
        const userId = req.foundUser._id
        const { commentId } = req.params
        const { content } = req.body

        if (!content?.trim()) {
            return res.status(400).json({
                success: false,
                msg: "Comment cannot be empty"
            })
        }

        const comment = await commentModel.findById(commentId)

        if (!comment) {
            return res.status(404).json({
                success: false,
                msg: "Comment not found"
            })
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                msg: "You can only edit your own comment"
            })
        }

        comment.content = content.trim()

        await comment.save()

        return res.status(200).json({
            success: true,
            msg: "Comment updated successfully",
            data: comment
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            msg: "Unable to update comment"
        })
    }
})


router.get("/my-comments", async (req, res) => {
    try {
        const userId = req.foundUser._id

        const comments = await commentModel
            .find({ user: userId })
            .populate(
                "user",
                "firstName lastName username displayPicture"
            )
            .populate(
                "post",
                "content imgUrl user"
            )
            .sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            data: comments
        })
    } catch (error) {
        console.log(error)

        return res.status(500).json({
            success: false,
            msg: "Unable to get replies"
        })
    }
})

module.exports={
    commentRouter:router
}