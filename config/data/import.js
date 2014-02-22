'use strict';

var mongoose = require('mongoose')
   , User = mongoose.model('User');

var userID = "masterwayne@batman.com";

User.findOne({email: userID})
    .exec(function (err, foundUser) {
        if (err) throw err;
        if (!foundUser) {
            new User({
                name: "Dick Grayson",
                email: 'robin@batman.com',
                username: "robin",
                password:'robin'
            }).save();

            var user = new User({
                name: "Bruce Wayne",
                email: userID,
                username: "masterwayne",
                password:'batman'
            });
            user.save(function(err, user){
                if (err){
                    console.error(err);
                } else {
                    console.log("save user " + user.name);
                }
            });
        }
    });
