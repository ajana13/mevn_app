const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../config/keys').secret
const User = require('../../model/User')

/*
 * @route POST api/users/register
 * @desc Register the User
 * @access Public 
 */

router.post('/register', (req, res) => {
    let { name, username, email, password, confirm_password } = req.body
    if (password !== confirm_password) {
        return res.status(400).json({
            msg: "Passwords do the match"
        });
    }
    // Check unique Username
    User.findOne({
        username: username
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Username is already taken"
            });
        }
    })
    // Check unique Email
    User.findOne({
        email: email
    }).then(user => {
        if (user) {
            return res.status(400).json({
                msg: "Email is already registered"
            });
        }
    })
    // Everything is fine, then data is valid. Go ahead and register the user
    let newUser = new User({
        name, username, password, email
    });
    // Hash our password (using bcrypt)
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save().then(user => {
                return res.status(201).json({
                    success: true,
                    msg: "Hurray! User is now registered"
                })
            });
        });
    })
});

/*
 * @route POST api/users/login
 * @desc Signing in the User
 * @access Public 
 */

router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }).then(user => {
        if (!user) {
            return res.status(404).json({
                msg: "Username is not found",
                success: false
            });
        }
        // In user found, compare password
        bcrypt.compare(req.body.password, user.password).then(isMatch => {
            if (isMatch) {
                // User entered correct password, we need to send JSON token for that user
                const payload = {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username
                }
                jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) => {
                    res.status(200).json({
                        success: true,
                        user: user,
                        token: `Bearer ${token}`,
                        msg: "Hurray! You are now logged in! "
                    });
                });
            } else {
                return res.status(404).json({
                    msg: "Incorrect Password",
                    success: false
                });
            }
        })
    });
});

/*
 * @route GET api/users/profile
 * @desc Return the User's data
 * @access Private 
 */

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        user: req.user
    });
});

module.exports = router;