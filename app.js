const express = require("express");
const ejs = require('ejs');
const app= express();
const path = require("path");
const bodyparser= require("body-parser");
const flash = require('connect-flash');
const db = require("./configs/DBconnection");
const formRoutes = require("./routers/form");

//middlewares
app.set('view engine', 'ejs');

//initialize app
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(flash());

//path
const static_path= path.join(__dirname, "public");
app.use(express.static(static_path));


//db connection
db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

//routing
app.get('/', function (req, res) {
    res.render('index');
})

//routers
app.use("/", formRoutes);

//port
const port = process.env.PORT || 4000;
app.listen(port, ()=>{ console.log(`listening at port: ${port}`); })