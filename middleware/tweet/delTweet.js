/**
 * Tweet törlése
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    const {tweetModel, userModel, saveDB} = objRepo;
    return (req, res, next) => {
        tweetModel.remove(res.locals.tweet);
        res.locals.user.tweets_count--;

        return saveDB(err => {
            if (err) {
                return next(err);
            }

            return res.redirect('/tweet/' + req.session.slug);
        });
    }
}