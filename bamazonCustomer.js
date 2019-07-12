const mysql = require("mysql");
const inquirer = require("inquirer");

const options = ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "B@y3kW@5Th3F1r5t.Ez10W@5Th3B35t",
    database: "bamazon"
});

const conn = mysql.createConnection(options);

conn.connect(function (err) {
    if (err) throw err;
    console.log("connected");
    displayInventory();
});

displayInventory = () => {
    inquirer.prompt([
        {
            name: "displayInv",
            message: "Would you like to look at the inventory first?",
            type: "list",
            choices: ["Yes", "No"]
        }
    ]).then((answer) => {
        if (answer.displayInv === "Yes") {
            conn.query("SELECT * FROM products", (err, res) => {
                if (err) throw err;
                console.table(res);
                purchase();
            })
        } else {
            purchase();
        }
    }
    )
}

purchase = () => {
    inquirer.prompt([
        {
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
        let amount = buying.amount;
        let product = buying.productID
        // console.log(amount);
        conn.query("SELECT product_name, department_name, price, stock_quantity FROM products WHERE ?", { item_id: product }, (err, res) => {
            if (err) throw err;
            console.log(`You are trying to purchase ${amount} of ${res[0].product_name} from ${res[0].department_name} at a cost of $${res[0].price} each`);
            if (res[0].stock_quantity >= amount) {
                let newQuantity = res[0].stock_quantity - amount
                conn.query("UPDATE products SET ? WHERE ?"),
                    [{
                        stock_quantity: newQuantity
                    }, {
                        item_id: product
                    }]
                let cost = amount * res[0].price
                console.log(`Congratulations, you have purchased ${amount} of ${res[0].product_name} for a total of $${cost}`);
                shopping();
            } else {
                console.log("Sorry, we don't have enough inventory to fulfill your request!");
                shopping();
            }



            // conn.query("SELECT stock_quantity FROM products")
            // conn.query("UPDATE products SET ? WHERE ?")

        });
    })

}

shopping = () => {
    inquirer.prompt([
        {
            name: "shop",
            message: "Would you like to continue shopping?",
            type: "list",
            choices: ["Yes", "No"]
        }
    ]).then((answer) => {
        if (answer.shop === "Yes") {
            displayInventory();
        } else {
            conn.end();
        }
    })
}
