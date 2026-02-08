/**
 * Json adat szolgáltatás lapozóhoz - a res.locals-on lehelyezet field (tweet) számossága,
 * hogy van e további találat és az utolsó bejegyzés dátuma
 * @param objRep
 * @param field
 * @returns {(function(*, *, *): (*))|*}
 */
module.exports = (objRep, field) => {
    return (req, res, next) => {

        if (typeof req.params.type === 'undefined' || req.params.type !== 'json') {
            return next();
        }
        const result = {};

        if (res.locals[field].length > 6) {
            result.isContinue = true;
            result.timestamp = res.locals[field][5].created_at;
        } else {
            result.isContinue = false;
            result.timestamp = 0;
        }

        return res.json(result);
    }
}