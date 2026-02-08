/**
 * Tweethez tartozó user (aki a res.local.user-en van elhelyezve) azonos-e a belépett userrel
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    return (req, res, next) => {
        let isOwner = false;

        if (typeof req.session.userid !== 'undefined' && typeof res.locals.user !== 'undefined' && res.locals.user.id === req.session.userid) {
            isOwner = true;
        }

        res.locals.isOwner = isOwner;
        return next();
    }
}