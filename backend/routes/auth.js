const express= require('express');
const AuthController = require('../controllers/auth');
const router= express.Router();

//Register a User
router.post("/register", AuthController.registerUser);


//Login a User
router.post("/login", AuthController.logInUser);    

module.exports= router;
