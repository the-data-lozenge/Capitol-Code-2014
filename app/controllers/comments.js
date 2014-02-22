
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

/**
 * Create comment
 */

exports.create = function (req, res) {
  var item = req.item;
  var user = req.user;

  if (!req.body.body) return res.redirect('/review');

  item.addComment(user, req.body, function (err) {
    if (err) return res.render('500');
    res.redirect('/review');
  });
};
