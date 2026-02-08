/**
 * Követés visszavonása
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    const {saveDB, userModel} = objRepo;
    return (req, res, next) => {
        if (typeof req.params.userid === 'undefined') {
            return res.redirect('/');
        }

        const user = userModel.findOne({
            id: req.session.userid
        });

        if (!user) {
            return next(new Error('A felhasználó nem létezik!'));
        }

        if (user.followers.includes(req.params.userid) === true) {
            user.followers = user.followers.filter(e => e !== req.params.userid);
            req.session.followers = user.followers;
        } else {
            return res.redirect('/my-followers');
        }

        return saveDB((err) => {
            if (err) {
                return next(err);
            }

            return req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/my-followers');
            });
        });
    }
}