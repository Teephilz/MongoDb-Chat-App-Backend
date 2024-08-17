
const User= require('../models/User');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const createErrorResponse = require('../utils/errorlogger');




class AuthController {
    // Register a user
    static async registerUser(req, res) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });

            const savedUser = await newUser.save();

            res.status(200).json({
                message: 'Account created successfully',
                user: savedUser,
            });
        } catch (e) {
            res.status(500).json(e);
        }
    }

    // Log in a user
    static async logInUser(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json(createErrorResponse({
                    success: false,
                    message: "User not found"
                }
                    
                ));
            }

            const validPass = await bcrypt.compare(req.body.password, user.password);
            if (!validPass) {
                return res.status(422).json(createErrorResponse({
                    success:false,
                    message: "Incorrect Password"
                }
                    
                ));
            }
            const { password, ...others } = user._doc;
            const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });

        

            res.cookie('access_token', accessToken, { httpOnly: true })
                .status(200)
                .json({
                    message: 'Logged in successfully',
                    user: others,
                    accessToken:accessToken,
                
                });
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

module.exports = AuthController;