var mongoose = require('mongoose')
  , Item = mongoose.model('Item');

exports.next = function(req, res) {
    Item.find().where('user').ne(req.user).exec(function (err, item) {
        if (err) {
            rs.flash("Error selecting item");
            res.redirect('/');
        }
        console.log(item);
        var rand = Math.floor(Math.random() * item.length);
        var randomItem = item[rand];
        if (randomItem == undefined) {
            res.render('items/noitems', {});
        } else {
            res.redirect('/items/'+ randomItem.id + '/review');
        }
    });
};