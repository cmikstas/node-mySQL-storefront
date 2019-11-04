/** Require Variables **/
var mysql = require("mysql");
var inquirer = require("inquirer");

/** MySQL Connection Information **/
var connection = mysql.createConnection(
{
    host: "localhost",
        
    // Your port; if not 3306
    port: 3306,
        
    // Your username
    user: "root",
        
    // Your password and database that is being accessed
    password: "root",
    database: "bamazon"
});

/** MySQL Connection **/
connection.connect(function(err)
{
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    managerOptions();
});

function managerOptions()
{
    inquirer.prompt([
    {
        type: "list",
        name: "managerOptions",
        message: "What would you like to do?",
        choices:
        [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
        ],
    }]).then(function(value)
    {
        //console.log(value);
        switch(value.managerOptions)
        {
            case "View Products for Sale":
                return showProducts();

            case "View Low Inventory":
                return;

            case "Add to Inventory":
                return;

            case "Add New Product":
                return;

            default:
                return;
        }
    })
}

function showProducts()
{
    connection.query("SELECT * FROM products", function (err, res)
    {
        if (err) throw err;

        console.log("Current Item Stock");

        console.log(" | " + "Item ID" + " | " + "Product Name" + " | " + "Department Name" + " | " + "Item Price" + " | " + "Quantity" + " | ");
        console.log(" | " + "-------" + " | " + "------------" + " | " + "---------------" + " | " + "----------" + " | " + "--------" + " | ");

        for (var i = 0; i < res.length; i++)
        {
            console.log(" | " + (i+1) + "      " + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
        }

        console.log("\n");
        connection.end();
    })
}