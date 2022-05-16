const router =  require("express").Router();
const db = require("../configs/DBconnection");

const getTables = async(email, processResult) => {
    db.query(`SELECT tableName FROM tableInfo WHERE email = "${email}";`, function (err, result) {
        if (err) 
            res.render('dashboard');
            processResult(result);
    });	
}

router.get("/delete", async(req, res)=>{
    getTables(req.session.user.email, (result)=>{
        res.render('deletetable', {data: result});
    })
})

router.post("/delete", async(req, res)=>{
    
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

            getTables(req.session.user.email, (result)=>{
                return res.render('deletetable', {data: result, msg: "Table successfully deleted.", color: "alert-success"} );
            })
        }
    })  
})


module.exports = router;