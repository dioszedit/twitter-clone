const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { flash } = require('express-flash-message');

const {initDB} = require('./services/db');

const app = express();

app.use('/upload',express.static('upload'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'xrtrr64657h&@yhhada',
    resave: false,
    saveUninitialized: true
}));
app.use(flash({ sessionKeyName: 'flashMessage' }));

app.set('view engine', 'ejs');

initDB((err, {tweetModel, userModel, saveDB}) => {
    if (err) {
        console.error("App cannot start", err);
    }

    require('./router')(app, {tweetModel, userModel, saveDB});

    app.listen(3000, function () {
        console.log("Running on: 3000");
    })
});