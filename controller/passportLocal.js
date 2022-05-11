//Authentication Strategy
const bcrypt = require('bcryptjs');
const db = require("../configs/DBconnection");
var localStrategy = require('passport-local').Strategy;

module.exports = function (passport) {

    // LOCAL LOGIN 
    passport.use('local-login', new localStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, email, password, done) { 
            email = email.toLowerCase();
            db.query("SELECT * FROM users WHERE email = ?",[email], function(err, result){
                if (err)
                    return done(err);
                if (!result.length) {
                    console.log('No user found.');
                    return done(null, false, {message: 'No user found.'}); 
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, result[0].password))
                    return done(null, false, {message: 'Oops! Wrong password.'}); // create the loginMessage and save it to session as flashdata

                req.session.user=result[0];
                console.log(req.session.user)
                // all is well, return successful user
                return done(null, result[0]);
            });
        }
    )
)
    // passport session setup required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {        
        done(null, user.email);
    });

    // used to deserialize the user
    passport.deserializeUser(function(email, done) {
        db.query("SELECT * FROM users WHERE email = ? ",[email], function(err, result){
            done(err, result[0]);

        });
    });

}
//End of Authentication Strategy

