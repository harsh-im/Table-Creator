const express = require("express");
const ejs = require('ejs');
const app= express();
const path = require("path");
//middlewares
app.set('view engine', 'ejs');

//path
const static_path= path.join(__dirname, "public");
app.use(express.static(static_path));


//routing
app.get('/', function (req, res) {
    res.render('index');
})


//port
const port = process.env.PORT || 4000;
app.listen(port, ()=>{ console.log(`listening at port: ${port}`); })