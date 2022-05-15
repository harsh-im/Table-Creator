const router =  require("express").Router();
const db = require("../configs/DBconnection");


router.get("/create", async(req, res)=>{
    console.log(req.session.user)
    res.render('createtable');
})

router.post("/create", async(req, res)=>{
    console.log(req.body)

    let data = {... req.body};
    let sqlQuery = `CREATE TABLE ${data.tableName} (`
    for(let i=0; i<data.colNumber; i++)
    {
        if(data[`dataType${i+1}`] == 'string')
            data[`dataType${i+1}`] = 'text'
        if(data[`dataType${i+1}`] == 'number')
            data[`dataType${i+1}`] = 'int'
        if(data[`dataType${i+1}`] == 'email')
            data[`dataType${i+1}`] = 'varchar(30)'
        sqlQuery += ` ${data[`colName${i+1}`]} ${data[`dataType${i+1}`]},`
        if(data.primaryKey == i+1)
        {
            sqlQuery = sqlQuery.substring(0, sqlQuery.length -1) + ` PRIMARY KEY,`
        }
    }
    sqlQuery = sqlQuery.substring(0, sqlQuery.length -1) + `);`
    console.log(sqlQuery)

    db.query(sqlQuery, function (err, result) {
        if (err) 
            res.render('createtable', {msg: err, color: "alert-danger"} );
            
        db.query(`INSERT INTO history(email, history, time) VALUES("${req.session.user.email}", "'${req.body.tableName}' table is created", NOW());`,
            function (err, result) {})
        db.query(`INSERT INTO tableInfo (email, tableName) VALUES("${req.session.user.email}", "${req.body.tableName}");`,
            function (err, result) {})

        res.render('createtable', {data: req.body, msg: `Table '${req.body.tableName}' successfully created`, color: "alert-success"} );
    });	
    
})

module.exports = router;