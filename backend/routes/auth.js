const express= require('express');
const User= require('../models/User');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const router= express.Router();

//Register a User
router.post("/register", async(req, res)=>{
    try{
        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(req.body.password, salt);

        const newUser= new User({
           username: req.body.username,
           email: req.body.email,
           password: hashedPassword
        }
        );
        const savedUser = await newUser.save();

    res.status(200).json({
        'message':'Account created successfully',
        'user': savedUser
    });
    }
    catch(e){
        res.status(500).json(e)
    }
});


//Login a User
router.post("/login", async(req, res)=>{
    try{
        const user = await User.findOne({
            email:req.body.email
        });

        !user && res.status(404).json("user not found" );

    const validPass= await bcrypt.compare(req.body.password, user.password);
    !validPass && res.status(422).json("Wrong credentials!");

    const {password, ...others} = user._doc;
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '5h'});     

    res .cookie("access_token", token, {
        httpOnly: true,
      }).status(200).json({
        'message':'Logged in successfully',
        'user': others,
        'token': token
    });
    }
    catch(e){
        res.status(500).json(e)
    }
});

module.exports= router;
