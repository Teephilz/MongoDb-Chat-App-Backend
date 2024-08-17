
const Post= require('../models/Post');
const createErrorResponse = require('../utils/errorlogger');


class PostController {
    // Create a post
    static async createAPost(req, res) {
        try {
            const theUserId = req.user.id;
            const newPost = new Post({
              ...req.body,
              userId: theUserId
            }
             );
            const savedPost = await newPost.save();
            res.status(200).json({
                message: 'Post created successfully',
                data: savedPost,
            });
        } catch (e) {
            res.status(500).json(
                createErrorResponse({
                    success:false,
                    message: e.message
                })
               );
        }
    }

    // Update a post
    static async updateAPost(req, res) {
        try {
            const theUserId = req.user.id;
            const post = await Post.findById(req.params.id);
            if (post.userId === theUserId) {
            
                const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

                res.status(200).json({
                    message: 'Post updated successfully',
                    data: updatedPost,
                });
            } else {
                res.status(403).json('You can only update your post');
            }
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    // Delete a post
    static async deleteAPost(req, res) {
        try {
            const theUserId = req.user.id;
            const post = await Post.findById(req.params.id);
            if (post.userId === theUserId) {
                await post.deleteOne();
                res.status(200).json('Post successfully deleted');
            } else {
                res.status(403).json('You are not authorized to delete this post');
            }
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    // Get all posts
    static async getPosts(req, res) {
        try {
               const theUserId = req.user.id;
            const posts = await Post.find();
            res.status(200).json({
                success: true,
                count: posts.length,
                results: posts,
            });
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    // Like or dislike a post
    static async likeAPost(req, res) {
        try {
            const theUserId = req.user.id;
            const post = await Post.findById(req.params.id);
            if (!post.likes.includes(theUserId )) {
                await post.updateOne({ $push: { likes: theUserId } });
                res.status(200).json('The post has been liked');
            } else {
                await post.updateOne({ $pull: { likes: theUserId } });
                res.status(200).json('The post has been disliked');
            }
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    // Get a post by ID
    static async getPostById(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            res.status(200).json({
                message: 'Post fetched successfully',
                details: post,
            });
        } catch (e) {
            res.status(500).json(e.message);
        }
    }

    // Get posts from a user and their friends
    static async getMyFriendsPost(req, res) {
        try {
            const currentUser = await User.findById(req.params.userId);
            const userPosts = await Post.find({ userId: currentUser._id });
            const friendPosts = await Promise.all(
                currentUser.followings.map((friendId) => Post.find({ userId: friendId }))
            );
            res.status(200).json(userPosts.concat(...friendPosts));
        } catch (e) {
            res.status(500).json(e.message);
        }
    }
}

module.exports = PostController;

