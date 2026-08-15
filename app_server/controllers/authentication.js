const mongoose = require('mongoose');
const User = require('../models/user');
// 1. Passport requirement added at the top
const passport = require('passport'); 

const register = async (req, res) => {
    // Validate message to ensure that all parameters are present
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    try {
        const user = new User({
            name: req.body.name,   // Set User name
            email: req.body.email, // Set email address
            password: ''           // Start with empty password
        });

        user.setPassword(req.body.password); // Set user password
        
        await user.save();
        
        // Return new user token
        const token = user.generateJWT();
        return res
            .status(200)
            .json({ token });
            
    } catch (err) {
        return res
            .status(400)
            .json(err);
    }
};

// 2. Your new Passport-delegated login function replacing the old stub
const login = (req, res) => { 
    // Validate message to ensure that email and password are present.
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({"message": "All fields required"});
    }

    // Delegate authentication to passport module
    passport.authenticate('local', (err, user, info) => {
        if (err) { 
            // Error in Authentication Process
            return res
                .status(404)
                .json(err);
        }
        if (user) { 
            // Auth succeeded - generate JWT and return to caller
            const token = user.generateJWT();
            res
                .status(200)
                .json({token});
        } else { 
            // Auth failed return error
            res
                .status(401)
                .json(info);
        }
    })(req, res);
};

// Export BOTH functions so routes/index.js can find them
module.exports = {
    register,
    login
};

