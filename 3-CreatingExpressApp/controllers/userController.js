const express = require('express');
const User = require('../models/user');

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

        .catch(err => {
            console.log(err)
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
                    })
                    const result =  newUser.save().then(result => {
                        return res.json({
                            status: 200,
                            message: 'sign up successful',
                            data: result,
                        })
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

module.exports = {
    userIndex,
    userSignUp,
}

