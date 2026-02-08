/**
 * Valamilyen titok (email vagy jelszóhoz tartozó) alapján keresi ki a felhasználót és a res.locals.user-nek adja át.
 * @param objRepo
 * @param whichField
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo, whichField) {
    const {userModel} = objRepo;
    return (req, res, next) => {

        if (typeof req.params.id === 'undefined' || typeof req.params.secret === 'undefined') {
            return next();
        }

        let filter = {};
        switch (whichField) {
            case 'email':
                filter = {secret_email: req.params.secret};
                break;
            case 'password':
                filter = {secret_password: req.params.secret};
                break;
            default:
                return res.redirect('/');
        }

        const user = userModel.findOne({
            id: req.params.id,
            ...filter
        });

        if (!user) {
            return res.redirect('/');
        }

        res.locals.user = user;

        return next();
    }
}