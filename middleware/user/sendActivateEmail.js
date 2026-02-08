/**
 * Email címet aktiválásához szükséges email kiküldése
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    const {userModel, uuid, saveDB, emailService} = objRepo;

    return (req, res, next) => {
        if (typeof req.body.email === 'undefined') {
            return next();
        }
        const user = userModel.findOne({
            pending_email: req.body.email.trim().toLowerCase(),
            secret_email: {'$ne': false}
        });

        if (!user) {
            res.locals.errors = res.locals.errors || [];
            res.locals.errors.push('Hiba történt az email aktiválási link kiküldése során!');
            return next();
        }

        emailService.sendEmail(user.email, "Aktíválja email címét", `Használd ezt a linket: http://localhost:3000/email/active/${user.id}/${user.secret_email}`);

        return saveDB(async (err) => {
            if (err) {
                return next(err);
            }
            await req.flash('success', "Az aktiváló email-t kiküldtük! Csak aktiválás után tudsz belépni!");
            return res.redirect('/');
        });
    }
}