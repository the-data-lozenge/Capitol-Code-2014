
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
}

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization : function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/users/'+req.profile.id);
    }
    next();
  }
}

/*
 *  Item authorization routing middleware
 */

exports.item = {
  hasAuthorization : function (req, res, next) {
    if (req.item.user.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/items/'+req.item.id);
    }
    next();
  }
};
