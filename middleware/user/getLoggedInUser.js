/**
 * A sessionben tárolt userid alapján kikeresi a belépet felhasználót és a res.locals.user-nek adja át.
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    const {userModel} = objRepo;
    return (req, res, next) => {
        if (typeof req.session.userid === 'undefined') {
            return next();
        }

        const user = userModel.findOne({
            id: req.session.userid
        });

        if (!user) {
            return next(new Error('A felhasználó nem létezik!'));
        }

        res.locals.user = user;

        return next();
    }
}