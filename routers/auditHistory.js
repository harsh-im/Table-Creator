const router =  require("express").Router();
const db = require("../configs/DBconnection");
const {requiresAuth} = require('express-openid-connect');



router.get("/history", requiresAuth(),  async(req, res)=>{
    db.query(`SELECT * FROM history WHERE email = "${req.oidc.user.email}"`, function (err, result) {
        if (err) 
            res.render('dashboard');
        res.render('auditHistory', {data: result} );
    });	
})


module.exports = router;