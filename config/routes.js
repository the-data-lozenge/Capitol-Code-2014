
/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  , items = require('../app/controllers/items')
  , auth = require('./middlewares/authorization')
  , votes = require('../app/controllers/votes')
  , review = require('../app/controllers/review')

  ;

/**
 * Route middlewares
 */

var itemAuth = [auth.requiresLogin, auth.item.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', users.show);
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin);
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback);

  app.param('userId', users.user);

  // item routes
  app.get('/items', items.index)
  app.get('/items/new', auth.requiresLogin, items.new);
  app.post('/items', auth.requiresLogin, items.create);
  app.get('/items/:id', items.show);
  app.get('/items/:id/edit', itemAuth, items.edit);
  app.get('/items/:id/reviewfeedback', itemAuth, items.reviewfeedback)
  app.get('/items/:id/review', items.review)
  app.put('/items/:id', itemAuth, items.update);
  app.del('/items/:id', itemAuth, items.destroy);

  app.param('id', items.load);

  // home route
  app.get('/', items.index);

  // comment routes
  var comments = require('../app/controllers/comments');
  app.post('/items/:id/comments', auth.requiresLogin, comments.create);

  // voteroutes 
  app.get('/items/:id/upvote',auth.requiresLogin , votes.upvote);
  app.get('/items/:id/downvote', auth.requiresLogin , votes.downvote);
  app.get('/items/:id/upvotecomment',auth.requiresLogin , votes.upvotecomment);
  app.get('/items/:id/downvotecomment', auth.requiresLogin , votes.downvotecomment);

  // review
  app.get('/review', auth.requiresLogin, review.next);

  // tag routes
  var tags = require('../app/controllers/tags');
  app.get('/tags/:tag', tags.index);

};
