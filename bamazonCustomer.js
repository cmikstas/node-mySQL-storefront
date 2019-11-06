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

        const ITEMIDLENGTH = 8;
        const PRODUCTLENGTH = 46;
        const DEPTLENGTH = 46;
        const PRICELENGTH = 11;
        const QUANTITYLENGTH = 10;

        console.log("\n" + "Current Item Stock");

        console.log("| Item ID | Product Name                                  | Department Name                               | Item Price  | Quantity   |");
        console.log("| ------- | --------------------------------------------- | --------------------------------------------- | ----------- | ---------- |");

        for (var i = 0; i < res.length; i++)
        {
            let itemIDLength = res[i].item_id.toString().length;
            //console.log(itemIDLength);
            let productLength = res[i].product_name.length;
            let deptLength = res[i].department_name.length;
            let priceLength = res[i].price.toString().length;
            let stockLength = res[i].stock_quantity.toString().length;

            let itemPadding = ITEMIDLENGTH - itemIDLength;
            let productPadding = PRODUCTLENGTH - productLength;
            let deptPadding = DEPTLENGTH - deptLength;
            let pricePadding = PRICELENGTH - priceLength;
            let quantityPadding = QUANTITYLENGTH - stockLength;

            let itemString = res[i].item_id.toString();
            let productString = res[i].product_name;
            let deptString = res[i].department_name;
            let priceString = res[i].price.toString();
            let stockString = res[i].stock_quantity.toString();

            for (let j = 0; j < itemPadding; j++)
            {
                itemString += " ";
            }

            for (let j = 0; j < productPadding; j++)
            {
                productString += " ";
            }

            for (let j = 0; j < deptPadding; j++)
            {
                deptString += " ";
            }

            for (let j = 0; j < pricePadding; j++)
            {
                priceString += " ";
            }

            for (let j = 0; j < quantityPadding; j++)
            {
                stockString += " ";
            }

            console.log("| " + itemString + "| " + productString + "| " + deptString + "| " + "$" + priceString + "| " + stockString + " |");
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
    connection.query("UPDATE products SET ? WHERE ?",
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