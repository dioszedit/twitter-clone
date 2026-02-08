const slugify = require("slugify");
/**
 * Felhasználó regisztrációja
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    const {userModel, uuid, slugify, saveDB} = objRepo;
    return async (req, res, next) => {

        if (typeof req.body.email === 'undefined'
            || typeof req.body.password === 'undefined'
            || typeof req.body.rePassword === 'undefined'
            || typeof req.body.name === 'undefined'
            || req.body.password !== req.body.rePassword
        ) {
            return next();
        }

        let slugName = slugify(req.body.name);
        let slugNameCount = userModel.chain().find({slug: {'$contains': slugName}}).count();

        const user = {
            id: uuid.v4(),
            name: req.body.name,
            slug: slugName + (slugNameCount > 0 ? '-' + slugNameCount : ''),
            email: req.body.email.trim().toLowerCase(),
            pending_email: req.body.email.trim().toLowerCase(),
            password: req.body.password,
            secret_email: uuid.v4(),
            secret_password: false,
            profile_img: '',
            header_img: '',
            created_at: Date.now(),
            tweets_count: 0,
            followers: []
        };

        try {
            res.locals.user = userModel.insert(user);
        } catch (err) {
            await req.flash('error', err);
            return next();
        }

        saveDB(next);
    }
}