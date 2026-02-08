/**
 * Egy felhasználó Tweetjeinek lekérdezése slug alapján
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    const {userModel, tweetModel} = objRepo;
    return (req, res, next) => {

        if (typeof req.params.slug === 'undefined') {
            return next();
        }

        const user = userModel.findOne({
            slug: req.params.slug,
            pending_email: false
        });

        if (!user) {
            return res.redirect('/');
        }

        const filter = {};

        if (typeof req.params.afterdate !== 'undefined') {
            filter.created_at = {'$lt': req.params.afterdate};
        }

        res.locals.user = user;
        res.locals.tweets = tweetModel.chain().find({
            userid: res.locals.user.id,
            ...filter
        })
            .simplesort('created_at', true)
            .limit(7)
            .data();

        return next();
    }
}