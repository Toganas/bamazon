// requring node packages
const mysql = require("mysql");
const inquirer = require("inquirer");
// connection information for mySQL
const options = ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "B@y3kW@5Th3F1r5t.Ez10W@5Th3B35t",
    database: "bamazon"
});
// creating server for mySQL
const conn = mysql.createConnection(options);

conn.connect(function (err) {
    if (err) throw err;
    console.log("connected");
    displayInventory();
});

// Asking if the user would like to look at the inventory before purchasing
displayInventory = () => {
    inquirer.prompt([
        {
            name: "displayInv",
            message: "Would you like to look at the inventory first?",
            type: "list",
            choices: ["Yes", "No"]
        }
    ]).then((answer) => {
        // Showing the inventory if the user chose "Yes"
        if (answer.displayInv === "Yes") {
            conn.query("SELECT * FROM products", (err, res) => {
                if (err) throw err;
                console.table(res);
                purchase();
            })
        } else {
            // Sending the user straight to purchases if they choose "No"
            purchase();
        }
    }
    )
}
// seetting up a purchase
purchase = () => {
    inquirer.prompt([
        {
            // Choosing an item_ID for purchase
            name: "productID",
            message: "What is the item_ID of the product you would like to purchase?",
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    console.log("\nitem_ID must be a number");
                }
            }
        },
        {
            // Asking how many of said item the user would like to purchase
            name: "amount",
            message: "How much would you like to purchase?",
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    console.log("\nThe amount you purchase must be a number");
                }
            }
        }
    ]).then((buying) => {
        // variables to be used with the queries
        let amount = buying.amount;
        let product = buying.productID
        
        // getting the product name, department name, price and quantity to be shown
        conn.query("SELECT product_name, department_name, price, stock_quantity FROM products WHERE ?", { item_id: product }, (err, res) => {
            if (err) throw err;
            // removing the amount purchased from the amount in stock
            let newQuantity = res[0].stock_quantity - amount;
            console.log(`You are trying to purchase ${amount} of ${res[0].product_name} from ${res[0].department_name} at a cost of $${res[0].price} each`);
            // Checking if the amount being purchased is less than or equal to the amount in stock
            if (res[0].stock_quantity >= amount) {
                // If there is enough stock for the amount being purchased, updating the mySQL DB with the new amount
                conn.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuantity
                        },
                        {
                            item_id: product
                        }
                    ]),
                    (err) => {
                        if (err) throw err;
                        // Finding the total cost of the purchase
                        let cost = amount * res[0].price
                        // console logging the amount of the purchase.
                        console.log(`Congratulations, you have purchased ${amount} of ${res[0].product_name} for a total of $${cost}`);
                    }
                    // asking if they want to keep shopping
                shopping();
            } else {
                // If the amount is more than there is in stock, informing the customer that there isn't enough inventory
                console.log("Sorry, we don't have enough inventory to fulfill your request!");
                // asking if the customer wants to continue shopping
                shopping();
            }

        });
    })

}
// Does the user want to keep shopping?
shopping = () => {
    inquirer.prompt([
        {
            name: "shop",
            message: "Would you like to continue shopping?",
            type: "list",
            choices: ["Yes", "No"]
        }
    ]).then((answer) => {
        // Sending the user back to the beginning and asking if they want to see the inventory
        if (answer.shop === "Yes") {
            displayInventory();
        } else {
            // closing the connection
            conn.end();
        }
    })
}
