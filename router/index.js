const uuid = require('uuid');
const multer = require('multer');
const slugify = require('slugify')
const path = require('path');
const fs = require('fs');
const {promisify} = require('util');

const emailService = require('../services/email');
const unlinkAsync = promisify(fs.unlink);

//user
const authMW = require('../middleware/user/auth');
const getLoggedInUserMW = require('../middleware/user/getLoggedInUser');
const getUserBySecretMW = require('../middleware/user/getUserBySecret');
const loginMW = require('../middleware/user/login');
const logoutMW = require('../middleware/user/logout');
const modifyUserMW = require('../middleware/user/modifyUser');
const modifyProfileMW = require('../middleware/user/modifyProfile');
const regMW = require('../middleware/user/reg');
const sendForgotPwMW = require('../middleware/user/sendForgotPw');
const sendActivateEmailMW = require('../middleware/user/sendActivateEmail');
const addFollowerMW = require('../middleware/user/addFollower');
const removeFollowerMW = require('../middleware/user/removeFollower');
const getFollowersMW = require('../middleware/user/getFollowers');


//public
const getUsersMW = require('../middleware/public/getUsers')
const getTweetBySlugNameMW = require('../middleware/public/getTweetBySlugName');
const getTweetOwner = require('../middleware/public/getTweetOwner');
const getFlashMessageMW = require('../middleware/public/getFlashMessage');
const resJsonMW = require('../middleware/public/resJson');


//tweet
const delTweetMW = require('../middleware/tweet/delTweet');
const getTweetMW = require('../middleware/tweet/getTweet');
const modTweetMW = require('../middleware/tweet/modTweet');
const newTweetMW = require('../middleware/tweet/newTweet');


const renderMW = require('../middleware/render');


const uploadMW = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './upload');
        },
        filename: function (req, file, cb) {
            const rnd = Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname).toLowerCase();
            return cb(null, `${file.fieldname}-${Date.now()}-${rnd}${ext}`);
        }
    })
});

module.exports = function (app, {tweetModel, userModel, saveDB}) {
    const objRepo = {
        tweetModel,
        userModel,
        uuid,
        slugify,
        saveDB,
        emailService,
        unlinkAsync
    };

    app.use('/forgotpw',
        sendForgotPwMW(objRepo),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'forgotpw'));

    app.use('/newpw/:id/:secret',
        getUserBySecretMW(objRepo, 'password'),
        modifyUserMW(objRepo, 'password'),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'newpw'));

    app.use('/reg', regMW(objRepo),
        sendActivateEmailMW(objRepo),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'reg'));

    app.get('/logout', logoutMW(objRepo));

    app.use('/profile',
        authMW(objRepo),
        getLoggedInUserMW(objRepo),
        uploadMW.fields([
            {name: 'profile', maxCount: 1},
            {name: 'header', maxCount: 1}
        ]),
        modifyProfileMW(objRepo),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'profile'));

    app.use('/tweet/new', authMW(objRepo),
        getLoggedInUserMW(objRepo),
        uploadMW.single('image'),
        newTweetMW(objRepo),
        modTweetMW(objRepo),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'new'));

    app.use('/tweet/edit/:tweetid',
        authMW(objRepo),
        getLoggedInUserMW(objRepo),
        uploadMW.single('image'),
        getTweetMW(objRepo),
        modTweetMW(objRepo),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'edit'));

    app.get('/tweet/del/:tweetid',
        authMW(objRepo),
        getTweetMW(objRepo),
        getLoggedInUserMW(objRepo),
        delTweetMW(objRepo));

    app.get('/tweet/:slug',
        getTweetBySlugNameMW(objRepo),
        getTweetOwner(objRepo),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'tweets'));

    app.get('/email/active/:id/:secret',
        getUserBySecretMW(objRepo, 'email'),
        modifyUserMW(objRepo, 'email'),
        loginMW(objRepo),
        getUsersMW(objRepo),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'index'));

    app.get('/privacy',
        renderMW(objRepo, 'privacy'));

    app.get('/users/:afterdate/:type',
        getUsersMW(objRepo),
        resJsonMW(objRepo, 'users'),
        renderMW(objRepo, 'ajax_users'));

    app.get('/tweets/:slug/:afterdate/:type',
        getTweetBySlugNameMW(objRepo),
        resJsonMW(objRepo, 'tweets'),
        renderMW(objRepo, 'ajax_tweets'));

    app.get('/following/:userid',
        authMW(objRepo),
        addFollowerMW(objRepo));

    app.get('/following/:userid/del',
        authMW(objRepo),
        removeFollowerMW(objRepo));

    app.get('/my-followers',
        authMW(objRepo),
        getFollowersMW(objRepo),
        renderMW(objRepo, 'followers'));

    app.get('/my-followers/:afterdate/:type',
        authMW(objRepo),
        getFollowersMW(objRepo),
        resJsonMW(objRepo, 'tweets'),
        renderMW(objRepo, 'ajax_follower_tweets'));

    app.use('/',
        loginMW(objRepo),
        getUsersMW(objRepo),
        getFlashMessageMW(objRepo),
        renderMW(objRepo, 'index'));

    return app;
}