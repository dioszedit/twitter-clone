/**
 * Elfelejtett jelszó kérés
 * @param objRepo
 * @returns {(function(*, *, *): void)|*}
 */
module.exports = function (objRepo) {
    const {userModel, uuid, saveDB, emailService} = objRepo;

    return (req, res, next) => {
        if (typeof req.body.email === 'undefined') {
            return next();
        }
        //Csak aktív felhasználók kérhetnek
        const user = userModel.findOne({
            email: req.body.email.trim().toLowerCase(),
            secret_email: false
        });

        if (!user) {
            res.locals.errors = res.locals.errors || [];
            res.locals.errors.push('Hiba az adatokban! Erre a címre nem küldhető jelszó kérő!');
            return next();
        }

        user.secret_password = uuid.v4();
        userModel.update(user);
        emailService.sendEmail(user.email, "Elfelejtett jelszó", `Használd ezt a linket: http://localhost:3000/newpw/${user.id}/${user.secret_password}`);
        res.locals.success = "Az emlékeztető email-t kiküldtük!";
        return saveDB(next);
    }
}