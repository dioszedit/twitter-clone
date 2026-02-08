/**
 * Moódosítja a felhasználó egy bizonyos adatát, amit a whichField (email vagy jelszó) paraméter határoz meg.
 * @param objRepo
 * @param whichField
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo, whichField) {
    const {saveDB} = objRepo;
    return (req, res, next) => {

        if (typeof res.locals.user === 'undefined'
            || (whichField === 'password' && (typeof req.body[whichField] === 'undefined' || typeof req.body['rePassword'] === 'undefined'))) {
            return next();
        }

        switch (whichField) {
            case 'email':
                res.locals.user.email = res.locals.user.pending_email;
                res.locals.user.pending_email = false;
                res.locals.user.secret_email = false;

                res.locals.success = "Sikeres email cím aktiválás!";
                break;
            case 'password':
                if (req.body[whichField] === req.body['rePassword']) {
                    res.locals.user[whichField] = req.body[whichField];
                    res.locals.user.secret_password = false;
                    res.locals.success = "Sikeres jelszó módosítás!";
                } else {
                    res.locals.errors = res.locals.errors || [];
                    res.locals.errors.push("Nem egyezik a két jelszó bekérő mező tartalma!");
                }
                break;
        }

        return saveDB(next);
    }
}