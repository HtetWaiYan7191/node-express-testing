const express = require('express');
const User = require('../models/user');
const UserVerification = require('../models/userVerification');

// email handler 
const nodemailer = require('nodemailer');

// unique string
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

//node mailer stuff 
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    }
})

// testing email is working or not 
transporter.verify((error, success) => {
    if(error) {
        console.log(error);
    } else {
        console.log('ready for messages');
        console.log(success);
    }
})
//password bycrypt 
const bcrypt = require('bcrypt');
//list
const userIndex = (req,res) => {
    User.find().sort({createdAt: -1}).then((result) => {
        res.json({
            status: 201,
            message: 'User list',
            data: result
        })
    })
    .catch((err) => {
        console.log(err)
    })
}
// send verification email 
const sendVerificationEmail = ({_id, email}, res) => {
    // url to be used in the email 
    const currentUrl = 'http://localhost:3000/';
    const uniqueString = uuidv4() + _id;
    
    // mail options 
    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: 'Verify Your Email ',
        html: `<p>Verify your email address to complete the signup and login into your account.</p>
        <p>This link <b>expires in 6 hours.</b></p>
        <p>Press Here <a href="${currentUrl}users/verify/${_id}/${uniqueString}">Click here to verify your account</a>
        to proceed.</p>`
    }

    const saltRounds = 10;
    bcrypt.hash(uniqueString, saltRounds).then(hashedUniquedString => {
        const newUserVerification = new UserVerification({
            userId: _id,
            uniqueString: hashedUniquedString,
        })

        newUserVerification.save().then(() => {
            transporter.sendMail(mailOptions).then(() => {
                res.json({
                    status: 'pending',
                    message: ' Verification email sent '
                })
            })
            .catch(() => {
                res.json({
                    status: 404,
                    message: 'Verification email failed.'
                })
            })
        })
        .catch((error) => {
            res.json({
                status: 404,
                message: 'An error occured while verificating the user '
            })
        })
    })
    .catch(() => {
        res.json({
            status: 404,
            message: 'An error occured while hashing the unique string'
        })
    })
}

// verify email 
const verifyEmail = async (req, res) => {
    let {userId, uniqueString} = req.params;
    UserVerification.find({userId})
    .then((result) => {
        if(result.length > 0 ) {
            const { expiresAt } = result[0]
            const hashedUniquedString = result[0].uniqueString
            if(expiresAt < Date.now()) {
                // record has expired so we delete it 
                UserVerification.deleteOne({userId})
                .then((result) => {
                    User.deleteOne({_id: userId})
                    .then(() => {
                        res.json({
                            message: 'link has expired'
                        })
                    })
                    .catch(err => {
                        res.json({
                            status: 404,
                            message: 'cannot delete User'
                        })
                    })
                }).catch((error) => {
                    res.json({
                        status: 400,
                        message: 'cannot delete user verifacation'
                    })
                })
            } else {
                bcrypt.compare(uniqueString, hashedUniquedString)
                .then((isMatch)=> {
                    if(isMatch) {
                        // string match so update the verification
                        User.updateOne({_id: userId}, {verified: true}).then(() => {
                            UserVerification.deleteOne({userId})
                            .then(() => {
                                res.json({
                                    status: 200,
                                    message: ' Verification update successful '
                                })
                            })
                        })
                    } 
                })
                .catch(err => {
                    res.json({
                        satus:400,
                        message: 'string does not match'
                    })
                })
            }
        } else {
            res.json({
                status: 404,
                message: 'Account record does not exist. Please sign up or log in . '
            })
        }
    })
    .catch((err) => {
        console.log(err);
        res.json({
            status: 404,
            message: 'user verification failed.'
        })
    })
}

// sign-up 
const userSignUp = async (req, res) => {
    let {username, email, password, phone} = req.body;
    username = username.trim();
    email = email.trim();
    password = password.trim();
    phone = phone.trim();

    if(username == "" || email == "" || password == "" || phone == "") {
        res.json({
            status: 404,
            message: "Empty Input field"
        })
    } else if(!/^[a-zA-Z]*$/.test(username)) {
        res.json({
            status: 404,
            message: "Invalid name entered"
        })
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        res.json({
            status: 404,
            message: "Invalid email format"
        });
    } else if(phone.length < 8) {
        res.json({
            status: 404,
            message: "Phone number length must be at least  8 digits"
        })
    } else if(password.length < 8) {
        res.json({
            status: 404,
            message: "Password length must be at least 8 characters long"
        })
    } else {
        try {
            const result = await User.find({email: email});
            if(result.length) {
                res.json({
                    status: 403,
                    message: " User with this email already exists "
                })
            } else {
                // create user and save it to the database
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword =>  {
                    const newUser = new User({
                        username: username,
                        email: email,
                        password: hashedPassword,
                        phone: phone,
                        verified: false,
                    })
                    newUser.save().then(result => {
                        sendVerificationEmail(result, res)
                    });
                })
                .catch(err => {
                    res.json({
                        status: 404,
                        message: 'An error occured while saving user account'
                    })
                })
            }
        } catch(err) {
            res.json({
                status: 200,
                message: " An error occured while checking for existing user "
            })
            return err
        }
    }
}

const userLogIn = async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if( email == "" || password == "" ) {
        res.json({
            status: 404,
            message: 'Empty credentials supplied'
        })
    } else {
        const result = await User.find({email});
        if(result.length) {
            if(!result[0].verified) {
                res.json({
                    status: 404,
                    message: ' Email has not been verified yet. Check out your email inbox '
                })
            } else {
                const hashedPassword = result[0].password
                const isPassword = await bcrypt.compare(password, hashedPassword)
                if(isPassword) {
                    res.json({
                        status: 200,
                        message: 'Signin successful',
                        data: result
                    })
                } else {
                    res.json({
                        status: 404,
                        message: 'Sign in Fail. Invalid Password Entered :(',
                    })
                }
            }
        }
    }
}

module.exports = {
    userIndex,
    userSignUp,
    userLogIn,
    verifyEmail,

}

