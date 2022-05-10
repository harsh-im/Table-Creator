const router =  require("express").Router();
const db = require("../configs/DBconnection");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const passport = require("passport");
require('../controller/passportLocal')(passport);
const cookieParser = require("cookie-parser");
const session = require("express-session");


router.use(cookieParser('secret'));
router.use(session({
    secret: 'secret',
    resave: true,
    maxAge: 3600000,
    saveUninitialized: true,
}))

router.use(passport.initialize());
router.use(passport.session());

//table creation
db.query(`CREATE TABLE IF NOT EXISTS users (name VARCHAR(30) NOT NULL, email VARCHAR(30) PRIMARY KEY, password VARCHAR(225) NOT NULL);`, function (err, result) {
    if (err)  throw err;
    console.log("user Table created");
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        next();
    } else {
        res.redirect('/');
    }
}

// for signup form
router.get('/signup', function(req, res) {
    res.render('index');
});

router.post("/signup", async(req, res)=>{

    try{
        var {name, email, password, confirmPassword} = req.body;
        if(!validator.isEmail(email))
            return res.status(400).render('index', {signErr: "Invalid Email.", email:email, name: name, color:"alert-danger"});
        if(password !== confirmPassword)
            return res.status(400).render('index', {signErr: "Password do not match!", email:email, name: name, color:"alert-danger"});
        if(!validator.isStrongPassword(password))
            return res.status(400).render('index', {signErr: "Strong Password should be at least 12 characters long and contain atleast 1 uppercase, 1 lowercase and 1 special symbol. ", email:email, name: name, color:"alert-danger"});
        else {
            db.query(`SELECT * FROM users WHERE email = "${email.toLowerCase()}";`,function(err,result){
			
                if (err) throw err;

                 if (result.length) {
                    res.render("index", { signErr: "User already exists.", color:"alert-danger"});

                } else {
                    // generate a salt
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) throw err;
                        // hash the password
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            // save user in db
                            db.query(`INSERT INTO users(name, email, password) VALUES("${req.body.name}", "${email.toLowerCase()}", "${hash}")`, function (err, result) {
                                if (err) throw err;
                                res.render("index", { signErr: "You have successfully signed up!", color:"alert-success"});
                            });	
                        })
                    });
                }	
            });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Internal Server Error!"});
    }
})


// for login form
router.get('/login', function(req, res) {
    res.render('index');
});

router.post('/login', (req, res, next)=>{
    passport.authenticate('local-login', {
        successRedirect : '/dashboard',
        failureRedirect : '/',
        failureFlash : true 
    })(req, res, next);
});

//for logout
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect("/");
})

// for dashboard
router.get("/dashboard", checkAuthenticated, (req, res)=>{
    res.render('dashboard', {user: req.user});
})


module.exports = router;