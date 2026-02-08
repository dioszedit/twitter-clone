/**
 * felhasználók lekérdezése
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
/**
 *
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    const {userModel} = objRepo;
    return (req, res, next) => {
        const filter = {};

        if(typeof req.session.userid !== 'undefined') {
            filter.id = {'$ne': req.session.userid};
        }

        if(typeof req.params.afterdate !== 'undefined') {
            filter.created_at = {'$lt': req.params.afterdate};
        }

        res.locals.users = userModel.chain().find({
            pending_email: false,
            ...filter
        })
            .simplesort('created_at', true)
            .limit(7)
            .data();

        return next();
    }
}