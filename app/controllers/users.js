/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var User = mongoose.model('User')
var Item = mongoose.model('Item')
var utils = require('../../lib/utils');

exports.signin = function (req, res) {
};

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
    res.redirect('/');
};

/**
 * Show login form
 */

exports.login = function (req, res) {
    res.render('users/login', {
        title: 'Login',
        message: req.flash('error')
    });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        user: new User()
    });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};

/**
 * Session
 */

exports.session = function (req, res) {
    res.redirect('/');
};

/**
 * Create user
 */

exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function (err) {
        if (err) {
            return res.render('users/signup', {
                errors: utils.errors(err.errors),
                user: user,
                title: 'Sign up'
            });
        }

        // manually login the user once successfully signed up
        req.logIn(user, function (err) {
            if (err) return next(err);
            return res.redirect('/');
        });
    });
};

/**
 *  Show profile
 */

exports.show = function (req, res) {
    var user = req.profile;

    var query = Item.find({ user: user.id})

    query.exec(function (err, items) {
        if (err) {
            req.flash = err;
            console.log( "ERROR: " + err)
        }

        itemsInProgress = []
        itemsInReview = []
        itemsReviewComplete = []

        items.forEach(function(item) {
            console.log(item.status)
            if (item.status === 'InProgress') {
                itemsInProgress.push(item)
            } else if (item.status === 'InReview') {
                itemsInReview.push(item)
            } else if (item.status === 'ReviewComplete') {
                itemsReviewComplete.push(item)
            }
        })

        res.render('users/show', {
            title: user.name,
            user: user,
            items: items,
            inProgress: itemsInProgress,
            inReview: itemsInReview,
            reviewComplete: itemsReviewComplete,

        });
    });
};

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
    User
        .findOne({ _id: id })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};
