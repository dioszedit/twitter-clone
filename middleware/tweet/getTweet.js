/**
 * Tweet lekérdezése
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    const {tweetModel} = objRepo;
    return (req, res, next) => {

        const tweet = tweetModel.findOne({
            id: req.params.tweetid,
            userid: req.session.userid
        })

        if (!tweet) {
            return res.redirect('/tweet/' + req.session.slug);
        }

        res.locals.tweet = tweet;

        return next();
    }
}