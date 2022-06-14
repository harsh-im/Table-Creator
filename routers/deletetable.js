const router =  require("express").Router();
const db = require("../configs/DBconnection");
const {requiresAuth} = require('express-openid-connect');


const getTables = async(email, processResult) => {
    db.query(`SELECT tableName FROM tableInfo WHERE email = "${email}";`, function (err, result) {
        if (err) 
            res.render('dashboard');
            processResult(result);
    });	
}


//delete table routes
router.get("/delete", requiresAuth(), async(req, res)=>{
    try{
        getTables(req.oidc.user.email, (result)=>{
            res.render('deletetable', {data: result});
        })
    }catch(err){
        console.log(err.message);
        res.status(500).send('internal server error ')
    }
})

router.post("/delete", requiresAuth(), async(req, res)=>{
    
    try{
        db.query(`DROP TABLE ${req.body.table};`, function (err, result) {
            if (err) 
                return res.render('deletetable', {msg: err, color: "alert-danger"});
            else{

                db.query(`DELETE FROM tableInfo WHERE tableName= "${req.body.table}";`, function (err, result) {
                    if (err) 
                        return res.render('deletetable', {msg: err, color: "alert-danger"} );
                });	
                
                db.query(`INSERT INTO history(email, history, time) VALUES("${req.oidc.user.email}", "'${req.body.table}' table is deleted", NOW());`,
                function (err, result) {})

                getTables(req.oidc.user.email, (result)=>{
                    return res.render('deletetable', {data: result, msg: "Table successfully deleted.", color: "alert-success"} );
                })
            }
        }) 
    }catch(err){
        console.log(err.message);
        res.status(500).send('internal server error ')
    }
})


module.exports = router;