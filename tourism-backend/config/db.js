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

// require("dotenv").config();
// const mysql = require("mysql2");

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT
// });