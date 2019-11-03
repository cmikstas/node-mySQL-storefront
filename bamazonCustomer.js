/** Require Variables **/
var mysql = require("mysql");
var inquirer = require("inquirer");

/** Global Variables **/

/** MySQL Connection **/
var connection = mysql.createConnection(
{
    host: "localhost",
    
    // Your port; if not 3306
    port: 3306,
    
    // Your username
    user: "root",
    
    // Your password and database that is being accessed
    password: "root",
    database: "greatbay_db"
});