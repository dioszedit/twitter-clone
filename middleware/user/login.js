/**
 * Email és jelszó alapján belépteti a felhasználót és a szükséges adatokat elhelyezi sessionbe (id, slug, followers)
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    const {userModel} = objRepo;
    return (req, res, next) => {

        if (typeof res.locals.user === 'undefined' && (typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined')) {
            return next();
        }

        let email = '';
        let password = '';

        if (typeof res.locals.user !== 'undefined') {
            email = res.locals.user.email;
            password = res.locals.user.password;
        } else {
            email = req.body.email;
            password = req.body.password;
        }

        const user = userModel.findOne({
            email: String(email).trim().toLowerCase(),
            password: String(password).trim(),
            pending_email: false
        });

        if (!user) {
            res.locals.errors = res.locals.errors || [];
            res.locals.errors.push('Hibás email cím vagy jelszó!');
            return next();
        }

        req.session.slug = user.slug;
        req.session.userid = user.id;
        req.session.followers = user.followers;
        req.session.name = user.name;
        req.session.profile_img = user.profile_img;
        return req.session.save(next);
    }
}