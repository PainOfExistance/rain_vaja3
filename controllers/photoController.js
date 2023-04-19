var CommentModel = require('../models/commentModel.js');
var PhotoModel = require('../models/photoModel.js');
var UserModel = require('../models/userModel');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
            .exec(function (err, photos) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }

                var ph = photos.map(user => user.toObject());
                if (typeof req.session?.user?.username != 'undefined') {
                    const data = {
                        data: ph,
                        session: req.session.user.username
                    };

                    return res.render('photo/list', { data: data });
                } else {
                    const data = {
                        data: ph,
                        session: "e"
                    };
                    return res.render('photo/list', { data: data });
                }

            });
    },

    mylist: function (req, res) {
        var id = req.params.id;
        PhotoModel.find({ postedBy: id }, function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var ph = photos.map(user => user.toObject());
            const data = {
                data: ph,
            };
            console.log(data);
            return res.render('photo/list', { data: data });
        });
    },

    search: function (req, res) {
        var id = req.params.id;
        PhotoModel.find({ tags: new RegExp(id, "gi") }, function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var ph = photos.map(user => user.toObject());
            if (typeof req.session?.user?.username != 'undefined') {
                const data = {
                    data: ph,
                    session: req.session.user.username
                };

                return res.render('photo/list', { data: data });
            } else {
                const data = {
                    data: ph,
                    session: "e"
                };
                return res.render('photo/list', { data: data });
            }
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }



            CommentModel.find({ parrentPost: id }, function (err, comment) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }

                if (!comment) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }

                var comment = comment.map(y => y.toObject());
                comment.reverse();
                var comments = [];
                for (var i = 0; i < comment.length; i++) {
                    if (comment[i].selected == "yes") {
                        comments.unshift(comment[i]);
                    } else {
                        comments.push(comment[i]);
                    }
                }
                if (typeof req.session?.user?.username != 'undefined') {
                    const data = {
                        post: photo.toObject(),
                        comment: comments,
                        session: req.session.user.username
                    };

                    return res.render('photo/post', { data: data });
                } else {
                    const data = {
                        post: photo.toObject(),
                        comment: comments,
                        session: "neke"
                    };

                    return res.render('photo/post', { data: data });
                }
            });
        });
    },

    /**
     * photoController.create()
     */
    create: function (req, res) {

        var today = new Date();
        var date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes();
        var photo = new PhotoModel({
            name: req.body.name,
            postedBy: req.session.user.username,
            description: req.body.desc,
            time: time + " " + date,
            tags: req.body.tags
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            UserModel.findOneAndUpdate(
                { username: req.session.user.username },
                { $inc: { questionnum: 1 } },
                { new: true },
                function (err, updatedComment) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating photo.',
                            error: err
                        });
                    }

                    if (!updatedComment) {
                        return res.status(404).json({
                            message: 'No such photo'
                        });
                    }

                return res.redirect('/');
                }
            );
            //return res.status(201).json(photo);
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({ _id: id }, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
            photo.path = req.body.path ? req.body.path : photo.path;
            photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
            photo.views = req.body.views ? req.body.views : photo.views;
            photo.likes = req.body.likes ? req.body.likes : photo.likes;

            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {

        PhotoModel.findByIdAndRemove(req.params.id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            PhotoModel.find()
                .exec(function (err, photos) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting photo.',
                            error: err
                        });
                    }

                    var ph = photos.map(user => user.toObject());
                    if (typeof req.session?.user?.username != 'undefined') {
                        const data = {
                            data: ph,
                            session: req.session.user.username
                        };

                        return res.render('photo/list', { data: data });
                    } else {
                        const data = {
                            data: ph,
                            session: "e"
                        };

                        return res.render('photo/list', { data: data });
                    }

                });
        });
    },

    publish: function (req, res) {
        return res.render('photo/publish');
    }
};
