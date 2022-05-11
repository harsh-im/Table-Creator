const router =  require("express").Router();
const db = require("../configs/DBconnection");


router.get("/history", async(req, res)=>{
    db.query(`SELECT * FROM history WHERE email = "${req.session.user.email}"`, function (err, result) {
        if (err) 
            res.render('dashboard');
        console.log(result)
        res.render('auditHistory', {data: result} );
    });	
})


module.exports = router;