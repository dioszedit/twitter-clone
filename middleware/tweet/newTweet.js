/**
 * Új tweet létrehozása
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    const {tweetModel, uuid} = objRepo;
    return (req, res, next) => {
        if (typeof req.body.content === 'undefined') {
            return next();
        }

        res.locals.tweet = tweetModel.insert({
            id: uuid.v4(),
            userid: req.session.userid,
            image: '',
            created_at: Date.now()
        });

        res.locals.user.tweets_count++;

        return next();
    }
}