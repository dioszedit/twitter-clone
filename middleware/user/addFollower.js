/**
 * Követés beállítása, sikeres beállítás után átirényít a követési oldalra
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
        //user.followers = [];

        if (user.followers.includes(req.params.userid) === true) {
            return res.redirect('/my-followers');
        } else {
            user.followers.push(req.params.userid);
            req.session.followers = user.followers;
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