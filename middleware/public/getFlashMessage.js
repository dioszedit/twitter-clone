/**
 * Flash message kezelése (success, error), ha van elhelyezése res.locals-on
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    return async (req, res, next) => {
        let message = await req.consumeFlash('success');
        if (message.length > 0) {
            res.locals.success = message;
        }

        res.locals.errors = res.locals.errors || [];
        message = await req.consumeFlash('error');
        if (message.length > 0) {
            res.locals.errors.push(message);
        }

        return next();
    }
}