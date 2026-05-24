const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pallavi@19",
  database: "tourism_management",
  port: 3307
});
db.getConnection()
  .then(() => {
    console.log("MySQL Connected");
  })
  .catch((err) => {
    console.log(err);
  });
  
module.exports = db;