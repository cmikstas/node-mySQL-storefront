/** Require Variables **/
var mysql = require("mysql");
var inquirer = require("inquirer");

/** Global Variables **/
var itemNumber = 0;
var itemStock = 0;
var itemPrice = 0;
var purchaseTotal = 0;

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

        console.log("Current Item Stock");

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
            var value1 = parseInt(value);

            if (isNaN(value1))
            {
                return false;
            }

            if (value1 <= res.length)
            {
                itemNumber = value1;
                return true;
            }

            return false;
        }
    },
    {
        name: "itemCount",
        message: "How many would you like to purchase?",

        validate: function(value)
        {
            var value2 = parseInt(value);
            itemStock = res[itemNumber-1].stock_quantity;

            if (isNaN(value2) || value2 > itemStock)
            {
                if (isNaN(value2))
                {
                    console.log("\n" + "Invalid selection. Please try again." + "\n");
                    return false;
                }

                else if (value2 > itemStock)
                {
                    console.log("\n" + "Insufficient quantity. Please select again." + "\n");
                    return false;
                }
            }

            if (value2 <= itemStock)
            {
                idNumber = res[itemNumber - 1].item_id;
                amountOrdered = value2;
                itemStock = itemStock - value2;
                itemPrice = res[itemNumber - 1].price;
                //console.log("\n" + "Stock: " + itemStock +  " & " + "Price: " + itemPrice);
                return true;
            }

            return false;
        }
    }]).then(function(value)
    {
        stockQuantityUpdate();
    })
}

function stockQuantityUpdate()
{
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: itemStock
          },
          {
            item_id: idNumber
          }
    ])
    
    purchaseTotal = amountOrdered * itemPrice;
    console.log("Your order total is: " + "$" + purchaseTotal);
    connection.end();
}