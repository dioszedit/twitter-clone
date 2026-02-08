const loki = require('lokijs');
let db = false;

/**
 * Init database
 * @param cb
 */
function initDB(cb) {
    console.log("Init database");
    db = new loki('database.db');
    db.loadDatabase({}, err => {
        if (err) {
            return cb(err);
        }

        let tweetModel = db.getCollection("tweet");
        if (tweetModel === null) {
            tweetModel = db.addCollection("tweet", ["id", "userid"]);
        }

        let userModel = db.getCollection("user");
        if (userModel === null) {
            userModel = db.addCollection("user", {
                indices: ["id", "email", "slug"],
                unique: ["email", "slug"]
            });
        }

        db.saveDatabase(err => {
            if (err) {
                return cb(err);
            }

            console.log("DB save after init");
           // console.log(userModel.find());
           // console.log(tweetModel.find());
            return cb(undefined, {
                tweetModel,
                userModel,
                saveDB: (cb) => {
                    console.log("Saving DB...");
                    db.saveDatabase(cb);
                }
            });
        });
    });
}

module.exports.initDB = initDB;