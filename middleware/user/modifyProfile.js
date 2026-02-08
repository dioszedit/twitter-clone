/**
 * A profilhoz tartozó összes felhasználói adat módosítása
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    const {saveDB, unlinkAsync} = objRepo;
    const FILE_MAP = ['profile', 'header'];
    return (req, res, next) => {

        if (typeof req.body.name === 'undefined' || typeof req.body.email === 'undefined'
            || typeof res.locals.user === 'undefined' || typeof req.files === 'undefined') {
            return next();
        }

        let deleteFile = [];

        FILE_MAP.map((e) => {
            if (e in req.files) {
                let file = req.files[e];
                if (res.locals.user[e + '_img'] !== '') {
                    deleteFile.push(res.locals.user[e + '_img']);
                }

                res.locals.user[e + '_img'] = file[0].filename;
            } else {
                if (req.body[e + '_img'] === '' && res.locals.user[e + '_img'] !== '') {
                    deleteFile.push(res.locals.user[e + '_img']);
                }

                res.locals.user[e + '_img'] = req.body[e + '_img'];
            }
        });

        res.locals.user.name = req.body.name;
        res.locals.user.email = req.body.email;
        res.locals.success = "Sikeres adatmódosítás!";

        return saveDB((err) => {
            if (err) {
                return next(err);
            }

            req.session.name = res.locals.user.name;
            req.session.profile_img = res.locals.user.profile_img;

            deleteFile.map((e) => {
                unlinkAsync('./upload/' + e);
            });

            return req.session.save(next);
        });
    }
}