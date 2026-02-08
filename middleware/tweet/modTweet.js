/**
 * Tweet módosítása
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = function (objRepo) {
    const {saveDB, unlinkAsync} = objRepo;
    return (req, res, next) => {
        if (typeof req.body.content === 'undefined') {
            return next();
        }

        let deleteFile = '';
        res.locals.tweet.content = req.body.content;

        if (typeof req.file !== 'undefined' && req.file.filename !== 'undefined') {
            if (res.locals.tweet.image !== '') {
                deleteFile = res.locals.tweet.image;
            }

            res.locals.tweet.image = req.file.filename;
        } else {
            res.locals.tweet.image = req.body.tweetImg;
        }

        res.locals.tweet.updated_at = Date.now();

        return saveDB(err => {
            if (err) {
                return next();
            }

            if (deleteFile !== '') {
                unlinkAsync('./upload/' + deleteFile);
            }

            return res.redirect('/tweet/' + req.session.slug);
        });
    }
}