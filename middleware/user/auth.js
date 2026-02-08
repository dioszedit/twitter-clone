/**
 * Ellenőrzi, hogy van-e belépett user, ha nincs session-ben userid, akkor elirányít a főoldalra
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    return (req, res, next) => {
        if (typeof req.session.userid === 'undefined') {
            return res.redirect('/');
        }

        return next();
    }
}