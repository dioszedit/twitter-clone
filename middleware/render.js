/**
 *
 * @param objRepo
 * @param view
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo, view) {
    return (req, res, next) => {
        res.locals.adminUser = false;

        if (typeof req.session.userid !== 'undefined') {
            res.locals.adminUser = true;
            res.locals.slug = req.session.slug;
            res.locals.followers = req.session.followers;
            res.locals.name = req.session.name;
            res.locals.profile = req.session.profile_img;
        }

        return res.render(view, res.locals);
    }
}