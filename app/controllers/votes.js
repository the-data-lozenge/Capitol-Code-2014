/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

/**
 * Create upvote
 */
exports.upvote = function (req, res) {
  var item = req.item;
  var user = req.user;

  item.addVote(user, 1, function (err) {
    if (err) return res.render('500');
      res.redirect('back');
  });
};

exports.downvote = function (req, res) {
  var item = req.item;
  var user = req.user;

  item.addVote(user, -1 , function (err) {
    if (err) return res.render('500');
      res.redirect('back');
  });
};

exports.upvotecomment = function (req, res) {
  var item = req.item;
  var user = req.user;

  item.addCommentVote(user, 1, req.query.index, function (err) {
    if (err) return res.render('500');
    res.redirect('back');
  });
};

exports.downvotecomment = function (req, res) {
  var item = req.item;
  var user = req.user;

  item.addCommentVote(user, -1, req.query.index, function (err) {
    if (err) return res.render('500');
    res.redirect('back');
  });
};
