const router =  require("express").Router();
const db = require("../configs/DBconnection");
const {requiresAuth} = require('express-openid-connect');



router.get("/history", requiresAuth(),  async(req, res)=>{
    try{
        db.query(`SELECT * FROM history WHERE email = "${req.oidc.user.email}"`, function (err, result) {
            if (err) 
                res.render('dashboard');
            res.render('auditHistory', {data: result} );
        });	
    }catch(err){
        console.log(err.message);
        res.status(500).send('internal server error ')
    }
})


module.exports = router;