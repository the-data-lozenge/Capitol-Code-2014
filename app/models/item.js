
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Item Schema
 */

var ItemSchema = new Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},

  responseOptions: [{
      id: {type : String, default : '' },
      text: {type : String, default: ''},
      isCorrect: {type : Boolean, default: false}
  }],

   selectedResponseOptions: [{
         responseid: {type : String, default : '' },
         userid: [{type : Schema.ObjectId, ref : 'User'}]
     }],

  user: {type : Schema.ObjectId, ref : 'User'},

  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now },
    votes: { type: {}, default: {} }
  }],

  tags: {type: [], get: getTags, set: setTags},

  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {type : Date, default : Date.now}, 
  votes: { type: {}, default: {} },
  status: {type: String, default: 'InProgress'} // 'InReview' | 'ReviewComplete'
})

/**
 * Validations
 */

ItemSchema.path('status').validate(function (status){
    return status === 'InProgress' || status === 'InReview' || status === 'ReviewComplete'
}, "Item status must be one of ['InProgress', 'InReview', 'ReviewComplete']");

ItemSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Item title cannot be blank')

ItemSchema.path('body').validate(function (body) {
  return body.length > 0
}, 'Item body cannot be blank')


ItemSchema.path('responseOptions').validate(function (responseOptions) {
    var result = true;
    for (var i = 0; i < responseOptions.length; i++){
        var option = responseOptions[i];
        if (option.id.length == 0 || option.text.length === 0){
            result = false;
        }
    }
    return result;
}, 'Each ResponseOption must have not-empty id and text.'),

/**
 * Pre-remove hook
 */

ItemSchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3')
  var files = this.image.files

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err)
  }, 'item')

  next()
})

/**
 * Methods
 */

ItemSchema.methods = {

  /**
   * Save item and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
    if (!images || !images.length) return this.save(cb)

    var imager = new Imager(imagerConfig, 'S3')
    var self = this

    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err)
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files }
      }
      self.save(cb)
    }, 'item')
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {
    var notify = require('../mailer/notify')

    this.comments.push({
      body: comment.body,
      user: user._id
    })

    notify.comment({
      item: this,
      currentUser: user,
      comment: comment.body
    })

    this.save(cb)
  },


  /**
   */
  addVote: function(user, val, cb) {
    this.votes[user._id]=val;
      // notes is opaque to mongoose - mark it as modified
    this.markModified('votes');
    this.save(cb)
  },

  addCommentVote: function( user, val, index, cb) {
      var i = parseInt(index);
      if(this.comments.length > i ) {
          this.comments[i].votes[user] = val;
          // mark comments as modified, no path to comments.votes
          this.markModified('comments')
      }
      this.save(cb)
  },

  vote_totals: function (vholder) {
      if(Object.keys(vholder.votes).length < 1) {
          return 0;
      }

      var keys = Object.keys(vholder.votes);
      var that = vholder;
      var values = keys.map(function (v) {
          return that.votes[v];
      });
      return values.reduce(
          function (a, b ) {
              return  a + b;
          }
      );
  },

    option_totals: function (vholder, optionId) {
          if((vholder.selectedResponseOptions).length < 1) {
              return 0;
          }

          if(vholder.selectedResponseOptions[optionId]){
             return  vholder.selectedResponseOptions[optionId].length;
          }  else {
              return 0;
          }

      }
}

/**
 * Statics
 */

ItemSchema.statics = {

  /**
   * Find item by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List items
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

mongoose.model('Item', ItemSchema)
