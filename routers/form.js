const router = require("express").Router();
const dotenv = require("dotenv");
const { auth } = require('express-openid-connect');
const {requiresAuth} = require('express-openid-connect');

dotenv.config({path:__dirname+'/../.env'})

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER
  };



// auth router attaches /login, /logout, and /callback routes to the baseURL
router.use(auth(config));

// req.isAuthenticated is provided from the auth router
router.get('/', (req, res) => {
  if(req.oidc.isAuthenticated()){
    res.render('dashboard', {user: req.oidc.user});
  }
  else{
    res.render('index');
  }
});

// for dashboard
router.get("/dashboard", requiresAuth(), (req, res)=>{
  res.render('dashboard',{user: req.oidc.user});
})


module.exports = router;