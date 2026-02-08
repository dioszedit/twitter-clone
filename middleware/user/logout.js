/**
 * Kilépteti a felhasználót, törli a session-t
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    return (req, res, next) => {
        return req.session.destroy(err => {
            if (err) {
                return next(err);
            }

            return res.redirect('/');
        });
    }
}