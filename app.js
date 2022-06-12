const express = require("express");
const ejs = require('ejs');
const app= express();
const path = require("path");
const bodyparser= require("body-parser");
const db = require("./configs/DBconnection");
const formRoutes = require("./routers/form");
const createtableRoutes = require("./routers/createtable");
const auditHistoryRoutes = require("./routers/auditHistory");
const deletetableRoutes = require("./routers/deletetable");
const edittableRoutes = require("./routers/edittable");
const showDataRoutes = require('./routers/showData');


//middlewares
app.set('view engine', 'ejs');


//initialize app
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//path
const static_path= path.join(__dirname, "public");
app.use(express.static(static_path));


//db connection - check
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

//table info table creation
db.query(`CREATE TABLE IF NOT EXISTS tableInfo (sno INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30), tableName VARCHAR(225) NOT NULL);`, function (err, result) {
    if (err)  throw err;
    console.log("table info Table created");
});

//audit history table creation
db.query(`CREATE TABLE IF NOT EXISTS history  (sno INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30), history VARCHAR(100) NOT NULL,  time DATETIME NOT NULL);`, function (err, result) {
    if (err)  throw err;
    console.log("audit history Table created");
});

//filter table creation
db.query(`CREATE TABLE IF NOT EXISTS filter  (sno INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(30) Not NULL, tableName VARCHAR(100) NOT NULL,  filterName VARCHAR(100) NOT NULL, columnName VARCHAR(100) NOT NULL, filterType VARCHAR(20) NOT NULL, filterValue VARCHAR(100) NOT NULL);`, function (err, result) {
    if (err)  throw err;
    console.log("filter Table created");
});


//routers
app.use("/", formRoutes);
app.use("/", createtableRoutes);
app.use("/", auditHistoryRoutes);
app.use("/", deletetableRoutes);
app.use("/", edittableRoutes);
app.use("/", showDataRoutes);

app.use((req, res) => {
    res.status(400).render('error'); 
  });
    

//port
const port = process.env.PORT || 3306;
app.listen(port, ()=>{ console.log(`listening at port: ${port}`); })