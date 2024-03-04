const express= require('express');
const Post= require('../models/Post');
const bcrypt= require('bcrypt');
const verifyToken= require('../middleware/verifyToken');
const router= express.Router();

//Create a post

router.post("/", verifyToken, async(req, res)=>{
    
try{ 
    const  newPost = new Post(req.body);
    const savedPost= await newPost.save();
    res.status(200).json({
     "message":"Post created Successfully",
     "data": savedPost
    });
}catch(e){
    res.status(500).json(e.message);
}
});


//Update a post

router.post("/:id", async(req, res)=>{
    
    try{ 
        const  post= await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await post.updateOne({ $set: req.body }, {new: true});
            res.status(200).json({
                "message":"Post updated Successfully",
                "data": post
               });
        } else{
            res.json(403).json("You can only update your post");
        }
       
    }catch(e){
        res.status(500).json(e.message);
    }
    });

    //Delete Post

    router.delete("/delete/:id", async(req, res)=>{
    
        try{ 
            const  post= await Post.findById(req.params.id);
            if(post.userId === req.body.userId){
                await post.deleteOne({ $set: req.body }, {new: true});
                res.status(200).json("post successfully deleted");
            } else{
                res.json(403).json("You are not authorized to delete this post");
            }
           
        }catch(e){
            res.status(500).json(e.message);
        }
        });


    // Get Posts 
    
    router.get("/", async(req, res)=>{
    
        try{ 
            const posts= await Post.find();
    
                res.status(200).json({
                    "success":true,
                    "count": posts.length,
                    "results": posts,
                
                });
            } 
        catch(e){
            res.status(500).json(e.message);
        }
        });


    

        //Like Post
        router.post("/like/:id", async(req, res)=>{
    
            try{ 
                const  post= await Post.findById(req.params.id);
                if(!post.likes.includes(req.body.userId)){
                    await post.updateOne({ $push: {likes: req.body.userId} }, {new: true});
                    res.status(200).json('The post has been liked');
                } else{
                    await post.updateOne({ $pull: {likes: req.body.userId} }, {new: true});
                    res.status(200).json('The post has been disliked');
                }
               
            }catch(e){
                res.status(500).json(e.message);
            }
            });

                  // Get Post by Id

        router.get("/:id", async(req, res)=>{
            try{
                const post= await Post.findById(req.params.id);
                res.status(200).json({
                    'message': "Post fetched successfully",
                    "details": post
                });

            }catch(e){
            res.status(500).json(e.message)
            }
         
        });

        router.get("/timeline/:userId", async(req, res)=>{
            try{
                const currentUser= await User.findById(req.params.userId);
                const userPosts= await Post.find({
                    userId: currentUser._id
                });
                const friendPosts= await Promise.all(
                    currentUser.followings.map((friendId)=>{
                        return Post.find({userId: friendId});
                    })
                )
                res.status(200).json(userPosts.concat(...friendPosts));

            }catch(e){
            res.status(500).json(e.message)
            }
         
        })


    
module.exports = router;