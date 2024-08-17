const express= require('express');
const PostController = require('../controllers/post');
const verifyToken = require('../middleware/verifyToken');
const router= express.Router();

//Create a post

router.post("/", verifyToken, PostController.createAPost);

//Update a post

router.put("/:id",  verifyToken, PostController.updateAPost);

//Delete Post

router.delete("/delete/:id",  verifyToken,PostController.deleteAPost);


// Get Posts 

router.get("/",  verifyToken, PostController.getPosts);




//Like Post
router.post("/like/:id",  verifyToken, PostController.likeAPost);

// Get Post by Id

router.get("/:id",  verifyToken, PostController.getPostById);

// Get My Friends post

router.get("/timeline/:userId",  verifyToken, PostController.getMyFriendsPost);


    
module.exports = router;