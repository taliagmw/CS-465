const express = require("express");
const router = express.Router();
const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");

// 1. Pull in the jsonwebtoken package required by your custom middleware
const jwt = require('jsonwebtoken');

// 2. Your custom authenticateJWT middleware method from the assignment sheets
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }
    
    let headers = authHeader.split(' ');
    if (headers.length < 1) {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(501);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (token == null) {
        console.log('Null Bearer Token');
        return res.sendStatus(401);
    }
    
    // Pull configuration secret and decode token
    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            // Note: .sendStatus() ends the response chain. If your assignment code uses 
            // .sendStatus(401).json(...), it might crash because headers are already sent.
            // Sending just the status code 401 satisfies the curriculum requirement safely.
            return res.sendStatus(401);
        }
        
        req.auth = verified; // Set the auth param to the decoded object
        next(); // Crucial: Called inside the callback so Express waits for validation to finish
    });
}

// --- Routes Configuration ---
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

router
  .route('/trips')
  .get(tripsController.tripsList) 
  .post(authenticateJWT, tripsController.tripsAddTrip); 

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;
