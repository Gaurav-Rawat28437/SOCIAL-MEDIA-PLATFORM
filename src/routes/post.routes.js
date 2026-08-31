const express=require("express")
const { postModel } = require("../models/post.model")
const router=express.Router()

router.post("/create", async (req, res) => {
    try {
        const { content, imgUrl } = req.body

        const foundUser=req.foundUser

        if (!content?.trim() && !imgUrl) {
            throw new Error("Post must have content or image")
        }

        const createdPost = await postModel.create({
            authorId: foundUser._id,
            content: content?.trim(),
            imgUrl
        })

        res.status(201).json({
            success: true,
            msg: "Post uploaded successfully",
            data: createdPost
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message
        })
    }
})

router.get("/my-posts", async (req, res) => {
    try {

        const page=Number(req.query.page || 1)
        const limit=Number(req.query.limit || 18)

        const skip=(page-1)*limit
        const posts = await postModel
            .find({
                authorId: req.foundUser._id,
                imgUrl:{$ne:""}
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit+1)

        const hasMore=posts.length>limit
       if(hasMore)
       {
        posts.pop()
       }

        res.status(200).json({
            success: true,
            data: posts,
            hasMore:hasMore
        })

    } catch (error) {

        res.status(400).json({
            success: false,
            msg: error.message
        })

    }
})

router.delete("/delete/:postId", async (req, res) => {
    try {

        const { postId } = req.params
        const foundUser=req.foundUser

        const deletedPost = await postModel.findOneAndDelete({
            _id: postId,
            authorId: foundUser._id
        })

        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                msg: "Post not found"
            })
        }

        res.status(200).json({
            success: true,
            msg: "Post deleted successfully"
        })

    } catch (error) {

        res.status(400).json({
            success: false,
            msg: error.message
        })

    }
})

router.patch("/edit/:postId", async (req, res) => {
    try {

        const { postId } = req.params
        const foundUser = req.foundUser
        const { content } = req.body

        const updatedPost = await postModel.findOneAndUpdate(
            {
                _id: postId,
                authorId: foundUser._id
            },
            {
                content: content?.trim() || ""
            },
            {
                new: true
            }
        )

        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                msg: "Post not found"
            })
        }

        res.status(200).json({
            success: true,
            msg: "Post updated successfully",
            data: updatedPost
        })

    } catch (error) {

        res.status(400).json({
            success: false,
            msg: error.message
        })

    }
})

router.get("/my-thoughts", async (req, res) => {
    try {

        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit || 18)

        const skip = (page - 1) * limit

        const thoughts = await postModel
            .find({
                authorId: req.foundUser._id,
                imgUrl: ""
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit + 1)

        const hasMore = thoughts.length > limit

        if (hasMore) {
            thoughts.pop()
        }

        res.status(200).json({
            success: true,
            data: thoughts,
            hasMore
        })

    } catch (error) {

        res.status(400).json({
            success: false,
            msg: error.message
        })

    }
})

router.get("/feed", async (req, res) => {
    try {

        const page = Number(req.query.page || 1)
        const limit = Number(req.query.limit || 18)

        const skip = (page - 1) * limit

        const totalPosts = await postModel.countDocuments()

        const posts = await postModel
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate(
                "authorId",
                "firstName lastName username displayPicture"
            )

        const hasMore = skip + posts.length < totalPosts


        res.status(200).json({
            success: true,
            data: posts,
            hasMore
        })

    } catch (error) {

        res.status(400).json({
            success: false,
            msg: error.message
        })

    }
})

module.exports={
    postRouter:router
}