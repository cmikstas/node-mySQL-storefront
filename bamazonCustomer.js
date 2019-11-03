/** Require Variables **/
var mysql = require("mysql");
var inquirer = require("inquirer");

/** Global Variables **/
var itemID = 0;


/** MySQL Connection Information**/
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

    viewItems();
});


/** Function List **/
function viewItems()
{
    connection.query("SELECT * FROM products", function (err, res)
    {
        if (err) throw err;

        console.log("current item stock");

        console.log(" | " + "Item ID" + " | " + "Product Name" + " | " + "Department Name" + " | " + "Item Price" + " | " + "Quantity" + " | ");
        console.log(" | " + "-------" + " | " + "------------" + " | " + "---------------" + " | " + "----------" + " | " + "--------" + " | ");

        for (var i = 0; i < res.length; i++)
        {
            console.log(" | " + (i+1) + "      " + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity + " | ");
        }

        console.log("\n");

        productSelection(res);
    })
}

function productSelection(res)
{
    inquirer.prompt([
    {
        name: "itemID",
        message: "Please select the item ID of the item you want to purchase",

        validate: function(value)
        {
            value = parseInt(value);

            if (isNaN(value))
            {
                return false;
            }

            if (value <= res.length)
            {
                itemID = value;
                //console.log(itemID);
                return true;
            }

            return false;
        }

    }]).then(function(value)
    {

    })
}