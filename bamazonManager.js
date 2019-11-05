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
                return showInv();

            case "View Low Inventory":
                return showLowInv();

            case "Add to Inventory":
                return updateInv();

            case "Add New Product":
                return addNewInv();

            default:
                return;
        }
    })
}

function showInv()
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

function showLowInv()
{
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res)
    {
        if (err) throw err;

        console.log("ITEMS WITH LOW INVENTORY");
        console.log("------------------------");
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

function updateInv()
{
    connection.query("SELECT * FROM products", function (err, res)
    {
        if (err) throw err;

        //console.log(res);

        inquirer.prompt([
        {
            name: "itemSelection",
            message: "Which item do you want to update inventory for?",

            validate: function(value)
            {
                var value1 = parseInt(value);

                if (isNaN(value1))
                {
                    console.log("\n" + "Invalid selection. Please try again." + "\n");
                    return false;
                }

                if (value1 <= res.length)
                {
                    //console.log("hello");
                    itemNumber = value1;
                    return true;
                }
            }
        },
        {
            name: "inventoryAdd",
            message: "How much inventory would you like to add?",
            
            validate: function(value)
            {
                var value2 = parseInt(value);

                if (isNaN(value2) || value2 < 1)
                {
                    console.log("Please enter a valid quantity to order.");
                    return false;
                }

                return true
            }
        }]).then(function(value)
        {
            let itemID = value.itemSelection;
            let inventoryUpdate = parseInt(value.inventoryAdd);
            let currentInventory = res[itemID-1].stock_quantity;
            let newInventoryAmt = currentInventory + inventoryUpdate;
            //console.log(newInventoryAmt);
            //console.log(inventoryUpdate);
            
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: newInventoryAmt
                },
                {
                    item_id: itemID
                }
            ])
            connection.end();
        })
    })
}

function addNewInv()
{
    connection.query("SELECT * FROM products", function (err, res)
    {
        if (err) throw err;

        inquirer.prompt([
        {
            name: "newProduct",
            message: "Please name the new product",

            validate: function(value)
            {
                if (value.length < 1)
                {
                    console.log("\n Please enter a valid item.");
                    return false;
                }

                return true;
            }
        },
        {
            name: "newDept",
            message: "Please enter which department this product goes in.",

            validate: function(value)
            {
                if (value.length < 1)
                {
                    console.log("\n Please enter a valid department.");
                    return false;
                }

                return true;
            }
        },
        {
            name: "newPrice",
            message: "What is the retail price of this item?",

            validate: function(value)
            {
                valuePrice = parseFloat(value);
                //console.log(valuePrice);

                if (isNaN(valuePrice) || valuePrice <= 0)
                {
                    console.log("\n Please enter a valid retail price");
                    return false;
                }

                return true;
            }
        },
        {
            name: "newStock",
            message: "How much stock needs to be added for this product?",

            validate: function(value)
            {
                valueStock = parseInt(value);
                //console.log(valueStock);

                if (isNaN(valueStock) || valueStock <= 0)
                {
                    console.log("\n Please enter a valid number");
                    return false;
                }

                return true;
            }
        }]).then(function(value)
        {
            //console.log(value);
            let newProduct = value.newProduct;
            let newDept = value.newDept;
            let newPrice = value.newPrice;
            let newStock = value.newStock;
            //console.log("New Prod: " + newProduct + "\n" + "New Dept: " + newDept + "\n" + "New Price: " + newPrice + "\n" + "New Stock: " + newStock);

            connection.query("INSERT INTO products SET ?",
            [
                {
                    product_name: newProduct,
                    department_name: newDept,
                    price: newPrice,
                    stock_quantity: newStock
                },
                function(err, res)
                {
                    if (err) throw err;
                    //console.log(res.affectedRows + " product inserted!\n");
                }
            ])
            connection.end();
        })
    })
}