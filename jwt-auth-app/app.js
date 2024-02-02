const express = require('express');
const app = express();
const User = require('./models/user');
const accountController = require('./controllers/accountController')
const LocalStrategy = require('passport-local');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');

app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
    secret: 'hellothisishtet',
    resave: false,
    saveUninitialized: true
  }));

const DBURL = "mongodb+srv://htetwaiyan:kw3gJpsoR21LecAu@node-jwt-auth.i1ojoe8.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(DBURL, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => app.listen(3000))
.catch((err) => console.log(err)); // connect database 

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
app.use(passport.initialize());

app.get('/', (req, res) => { res.send('Introduction JWT Auth') })
app.get('/profile', passport.authenticate('jwt', { session: false }), accountController.profile)
app.post('/login', passport.authenticate('local'), accountController.login)
app.post('/register', accountController.register)
