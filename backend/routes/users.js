const express= require('express');
const User= require('../models/User');

const router= express.Router();

// get friends

router.get("/friends/:userId", async(req, res)=>{
    try{
        const user= await User.findById(req.params.id);
        const friends= await Promise.all(
            user.followings.map((friendId)=>{
                return User.findById(friendId);
            })
        );

        let friendList= [];
        friends.map((friend)=>{
            const{_id, username, profilePicture }= friend;
            friendList.push({
                "id":_id,
              "username":username,
              "profilePicture": profilePicture})
        })
        res.status(200).json(friendList);

    }catch(e){
    res.status(500).json(e.message)
    }
 
});

//follow user
router.put("/follow/:id", async(req, res)=>{
   if(req.body.userId != req.params.id){
    try{
        const user= await User.findById(req.params.id);
        const currentUser= await User.findById(req.body.userId)
   if(!user.followers.includes(req.body.userId)){
    await user.updateOne({ $push : {followers: req.body.userId}});
    await currentUser.updateOne({ $push : {following: req.params.id}});
    res.status(200).json("User has been followed");
   }
   else{
    res.status(403).json("You already followed this user");
   }

    }catch(e){
        res.status(500).json(e)
    }
   }
   else{
    res.status(403).json("You cant follow yourself");
   }
});


//Unfollow user
router.put("/unfollow/:id", async(req, res)=>{
    if(req.body.userId != req.params.id){
     try{
         const user= await User.findById(req.params.id);
         const currentUser= await User.findById(req.body.userId)
    if(!user.followers.includes(req.body.userId)){
     await user.updateOne({ $pull : {followers: req.body.userId}});
     await currentUser.updateOne({ $pull : {following: req.params.id}});
     res.status(200).json("User has been unfollowed");
    }
    else{
     res.status(403).json("You already unfollowed this user");
    }
 
     }catch(e){
         res.status(500).json(e)
     }
    }
    else{
     res.status(403).json("You cant unfollow yourself");
    }
 });
 
module.exports = router;