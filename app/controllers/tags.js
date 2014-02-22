
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Item = mongoose.model('Item')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') };
  var perPage = 5;
  var page = req.param('page') > 0 ? req.param('page') : 0;
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  };

  Item.list(options, function(err, items) {
    if (err) return res.render('500');
    Item.count(criteria).exec(function (err, count) {
      res.render('items/index', {
        title: 'Items tagged ' + req.param('tag'),
        items: items,
        page: page,
        pages: count / perPage
      });
    });
  });
};
