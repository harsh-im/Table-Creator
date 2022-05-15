const router =  require("express").Router();
const db = require("../configs/DBconnection");


router.get("/delete", async(req, res)=>{
    db.query(`SELECT tableName FROM tableInfo WHERE email = "${req.session.user.email}";`, function (err, result) {
        if (err) 
            res.render('dashboard');
        res.render('deletetable', {data: result});
    });	
})

router.post("/delete", async(req, res)=>{

    if(typeof req.body.table === "undefined")
    {
        db.query(`SELECT tableName FROM tableInfo WHERE email = "${req.session.user.email}";`, function (err, result) {
            if (err) 
                return res.render('deletetable', {msg: err});
            return res.render('deletetable', {data: result, msg: "Please select the table.", color: "alert-danger"} );
        });	
    }
    else{
        
        db.query(`DROP TABLE ${req.body.table};`, function (err, result) {
            if (err) 
                return res.render('deletetable', {msg: err, color: "alert-danger"});
            else{

                db.query(`DELETE FROM tableInfo WHERE tableName= "${req.body.table}";`, function (err, result) {
                    if (err) 
                        return res.render('deletetable', {msg: err, color: "alert-danger"} );
                });	
                
                
                db.query(`INSERT INTO history(email, history, time) VALUES("${req.session.user.email}", "'${req.body.table}' table is deleted", NOW());`,
                function (err, result) {})


                db.query(`SELECT tableName FROM tableInfo WHERE email = "${req.session.user.email}";`, function (err, result) {
                    if (err) 
                        return res.render('deletetable', {msg: err, color: "alert-danger"});
                    return res.render('deletetable', {data: result, msg: "Table successfully deleted.", color: "alert-success"} );
                });	
            }
        });	
    }   
        
})



module.exports = router;