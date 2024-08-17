const express= require('express');
const User= require('../models/User');
const UserController = require('../controllers/users');
const verifyToken = require('../middleware/verifyToken');

const router= express.Router();

// get friends

router.get("/friends/:userId",  verifyToken,UserController.getUserFriendsById);

//follow user
router.put("/follow/:id",verifyToken, UserController.followAUser);


//Unfollow user
router.put("/unfollow/:id",verifyToken, UserController.unfollowAUser);
 
module.exports = router;