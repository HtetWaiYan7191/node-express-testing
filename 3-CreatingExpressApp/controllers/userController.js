const express = require('express');
const User = require('../models/user');

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

module.exports = {
    userIndex,
}

