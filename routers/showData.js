const router = require("express").Router();
const db = require("../configs/DBconnection");
const {requiresAuth} = require('express-openid-connect');


// Function to form query according to filter selected
const getQuery = (table, column, filter, value) => {
  let sqlQuery = `SELECT * FROM ${table} WHERE ${column} `;

  if (filter === "=s" || filter === "==s") {
    sqlQuery += `= "${value}"`;
  } else if (filter === "=") {
    sqlQuery += `= ${value}`;
  }else if (filter === "!=") {
    sqlQuery += `!= ${value}`;
  } else if (filter === "!=s") {
    sqlQuery += `!= "${value}"`;
  }else if (filter === "LIKE s") {
    sqlQuery += `LIKE '${value}%'`;
  } else if (filter === "LIKE e") {
    sqlQuery += `LIKE '%${value}'`;
  } else if (filter === "LIKE c") {
    sqlQuery += `LIKE '%${value}%'`;
  } else if (filter === "NOT LIKE c") {
    sqlQuery += `NOT LIKE '%${value}%'`;
  } else if (filter === "IS NULL") {
    sqlQuery += `IS NULL`;
  } else if (filter === "IS NOT NULL") {
    sqlQuery += `IS NOT NULL`;
  } else if (filter === ">") {
    sqlQuery += `> ${value}`;
  } else if (filter === "<") {
    sqlQuery += `< ${value}`;
  } else if (filter === ">s") {
    sqlQuery += `> '${value}'`;
  } else if (filter === "<s") {
    sqlQuery += `< '${value}'`;
  }else if (filter === "TRUE") {
    sqlQuery += `= 1`;
  } else if (filter === "FALSE") {
    sqlQuery += `= 0`;
  }else if (filter === "MORE THAN N DAYS AGO") {
    sqlQuery += `< NOW() - INTERVAL ${value} DAY`;
  }else if (filter === "EXACTLY THAN N DAYS AGO") {
    sqlQuery += `= NOW() - INTERVAL ${value} DAY`;
  }else if (filter === "LESS THAN N DAYS AGO") {
    sqlQuery += `> NOW() - INTERVAL ${value} DAY`;
  }
  console.log(sqlQuery)
  return sqlQuery;
};

//Function to get the list of tables
const getTables = async (email, res, processResult) => {
  db.query(
    `SELECT * FROM tableInfo WHERE email = "${email}"`,
    function (err, result) {
      if (err) res.render("dashboard");
      processResult(result);
    }
  );
};

//Function to show the table data
const showTable = async (query, table, res, processResult) => {
  db.query(query, function (err, tableData) {
    if (err) res.render("dashboard");
    let col = [];
    if (tableData.length !== 0) col = Object.keys(tableData[0]);
    processResult(table, col, tableData);
  });
};

router.get("/view", requiresAuth(), async (req, res) => {
  getTables(req.oidc.user.email, res, (rs) => {
    res.render("viewTable", { data: rs });
  });
});

router.post("/view", requiresAuth(), async (req, res) => {
  console.log(req.body)
  let data = { ...req.body };

  if(typeof data.saveFilterName !== 'undefined' && data.saveFilterName !=''){
    db.query(`INSERT INTO filter (email, tableName, filterName, columnName, filterType, filterValue) VALUEs('${req.oidc.user.email}', '${data.tableName}', '${data.saveFilterName}',' ${data.column}', '${data.filter}', '${data.value}')`, (err, result)=>{
      if(err) console.log(err)
    })
  }


  if (data.column !== undefined || data.applySavedFilter !='') {
    let dt;

    if (data.column !== undefined){
      db.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE TABLE_SCHEMA = "tablecreator" AND TABLE_NAME = "${data.tableName}";`,
        function (err, dataType) {
          if (err) res.render("dashboard");
          dataType.forEach((row) => {
            if (row.column_name === data.column) {
              dt = row.data_type;
              return;
            }
          });
        }
      );
    }
    

    let query = `SELECT * FROM ${data.tableName}`;
    if(typeof data.applySavedFilter != 'undefined' && data.applySavedFilter != ''){
      if(data.btn === 'Apply'){
        db.query(`SELECT * FROM filter WHERE email='${req.oidc.user.email}' AND tableName = '${data.tableName}' AND filterName = '${data.applySavedFilter}'`, (err, result)=>{
          query = getQuery(data.tableName, result[0].columnName, result[0].filterType, result[0].filterValue)
        })
      }
      else{
        db.query(`DELETE FROM filter WHERE email= '${req.oidc.user.email}' AND tableName = '${data.tableName}' AND filterName = '${data.applySavedFilter}'`, (err, result)=>{
        })
      }
    }
    else if (data.filter != undefined && ((typeof data.value != "undefined" && data.value != "")||(data.filter =='TRUE' || data.filter == 'FALSE' || data.filter =='IS NULL' || data.filter == 'IS NOT NULL'))) {
      query = getQuery(data.tableName, data.column, data.filter, data.value);
    }

    let allSavedFilters;
    db.query(`SELECT * FROM filter WHERE email='${req.oidc.user.email}' AND tableName='${data.tableName}';`, (err, result)=>{
      allSavedFilters = result;      
    })

    getTables(req.oidc.user.email, res, (rs) => {
      showTable(query, data.tableName, res, (table, col, tableData) => {
        res.render("viewTable", {
          data: rs,
          tables: tableData,
          column: col,
          tablename: table,
          datatype: dt,
          selectedCol: data.column,
          savedFilters: allSavedFilters
        });
      });
    });
  } else {
    const query = `SELECT * FROM ${data.tableName}`;
    getTables(req.oidc.user.email, res, (rs) => {
      showTable(query, data.tableName, res, (table, col, tableData) => {
        res.render("viewTable", {
          data: rs,
          tables: tableData,
          column: col,
          tablename: table,
          datatype: undefined,
          selectedCol: undefined,
          savedFilters: allSavedFilters
        });
      });
    });
  }
});

module.exports = router;
