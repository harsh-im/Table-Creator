const router =  require("express").Router();
const db = require("../configs/DBconnection");


const getStrings = (body, colData)=> {
    let col="", val="", empty="";
    for (key in body){
        if(key !=="table"){
            col+=key +",";
            if(body[key]==='')
                val+= `NULL,`;
            else if(isNaN(body[key])){
                empty="NO"
                val += `'${body[key]}' ,`;
            }
            else{
                empty="NO"
                val+= body[key] + " ,";
            }
        }
    }
    col = col.substring(0, col.length -1);
    val = val.substring(0, val.length -1);
    return{ col, val, empty}
}

const getTables = async(email, processResult) => {
    db.query(`SELECT tableName FROM tableInfo WHERE email = "${email}";`, function (err, allTables) {
        if (err) 
            res.render('dashboard');
            processResult(allTables);
    });	
}




router.get("/edit", async(req, res)=>{
    res.render('edittable');
})


router.get("/insertdata", async(req, res)=>{
    getTables(req.session.user.email, (allTables)=>{
        res.render('insertData', {tableNames: allTables} );
    })	    
})



router.post("/insertdata", async(req, res)=>{
    db.query(`SELECT column_name, data_type FROM information_schema.columns WHERE TABLE_SCHEMA = "tablecreator" AND TABLE_NAME = "${req.body.table}";`, function (err, colData) {
        if (err) console.log(err);
        db.query(`SHOW KEYS FROM ${req.body.table} WHERE key_name = "PRIMARY"`, function(err, keyData){

            getTables(req.session.user.email, (allTables)=>{
                let {col, val, empty} = getStrings(req.body, colData);
                    
                    if(empty!==''){
                         
                        db.query(`INSERT INTO ${req.body.table} (${col}) VALUES (${val});`, function (err, intertedData) {
                            if (err) 
                                return res.render('insertData',{data:colData, key_col:keyData[0].Column_name, tableNames:allTables, selected_table:req.body.table, intertedData: intertedData, msg: err, color:'alert-danger'});
                            
                                db.query(`INSERT INTO history(email, history, time) VALUES("${req.session.user.email}", "A row is inserted in '${req.body.table}' table", NOW());`,
                                    function (err, result) {})

                            res.render('insertData',{data:colData, key_col:keyData[0].Column_name, tableNames:allTables, selected_table:req.body.table, intertedData: intertedData, msg: 'Row inserted successfully!', color:'alert-success'});
                        });	
                    }
                    else{
                        res.render('insertData',{data:colData, key_col:keyData[0].Column_name, tableNames:allTables, selected_table:req.body.table});
                    }
                });	 
            })
        });	  
    })


module.exports = router;