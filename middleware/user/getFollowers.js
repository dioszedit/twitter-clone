/**
 * Követett személyek lekérdezése
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    const {tweetModel, userModel} = objRepo;
    return (req, res, next) => {
        if (typeof req.session.userid === 'undefined') {
            return res.redirect('/');
        }

        res.locals.users = userModel.find({
            id: { '$in': req.session.followers}
        });

        const filter = {};

        if (typeof req.params.afterdate !== 'undefined') {
            filter.created_at = {'$lt': req.params.afterdate};
        }

        res.locals.tweets = tweetModel.chain().find({
            userid: { '$in': req.session.followers},
            ...filter
        })
            .simplesort('created_at', true)
            .limit(7)
            .data();

        return next();
    }
}