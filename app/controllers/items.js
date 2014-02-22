
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Item = mongoose.model('Item')
  , utils = require('../../lib/utils')
  , _ = require('underscore');

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User');

  Item.load(id, function (err, item) {
    if (err) return next(err);
    if (!item) return next(new Error('Item ' + id + ' not found'));
    req.item = item;
    next();
  })
};

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Item.list(options, function(err, items) {
    if (err) return res.render('500');
    Item.count().exec(function (err, count) {
      res.render('items/index', {
        title: 'Items',
        items: items,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New item
 */

exports.new = function(req, res){
  res.render('items/new', {
    title: 'New Item',
    item: new Item({})
  });
};


/**
 * Review Item Feedback
 */

exports.reviewfeedback = function(req, res){

    res.render('items/feedbackform', {
      title: 'Review ' + req.item.title,
      item: req.item
    });
};

/**
 * Review Item
 */
exports.review = function(req, res) {
    res.render('items/review', {
        title: 'Review ' + req.item.title,
        item: req.item,
        user: req.user
    })
}

/**
 * Create an item
 */

exports.create = function (req, res) {
  var item = new Item(req.body);
  item.user = req.user;

  item.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created item!');
      return res.redirect('/items/'+item._id);
    }

    res.render('items/new', {
      title: 'New Item',
      item: item,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Edit an item
 */

exports.edit = function (req, res) {
  res.render('items/edit', {
    title: 'Edit ' + req.item.title,
    item: req.item
  });
};

/**
 * Update item
 */

exports.update = function(req, res){
  var item = req.item;
  item = _.extend(item, req.body);

  item.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/items/' + item._id);
    }

    res.render('items/edit', {
      title: 'Edit Item',
      item: item,
      errors: err.errors
    });
  });
};

/**
 * Show
 */

exports.show = function(req, res){
  res.render('items/show', {
    title: req.item.title,
    item: req.item,
    user: req.user
  });
};

/**
 * Delete an item
 */

exports.destroy = function(req, res){
  var item = req.item;
  item.remove(function(err){
    req.flash('info', 'Deleted successfully');
    res.redirect('/items');
  });
};

