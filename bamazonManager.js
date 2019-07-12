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
    // sending user to the top menu prompt
    menu();
});

// top menu prompt
menu = () => {
    inquirer.prompt([
        // Determining what the user wants to do
        {
            type: "rawlist",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"]
        }
    ]).then((res) => {
        switch (res.choice) {
            // Sending user to the prompt to view products for sale
            case "View Products for Sale":
                sale();
                break;
            // Sending user to the prompt to view low inventory
            case "View Low Inventory":
                low();
                break;
            // Sending user to the prompt to add inventory
            case "Add to Inventory":
                add();
                break;
            // // Sending user to the prompt to add a product
            // case "Add New Product":
            //     product();
            // close connection
            case "End Session":
                session();
                break;
        }
    })
}
// Displaying all items on sale
sale = () => {
    conn.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    })
}
// Displaying all items with less than 5 inventory remaining
low = () => {
    conn.query("SELECT * FROM products WHERE stock_quantity <5", (err, res) => {
        if (err) throw err;
        console.table(res);
        menu();
    })
}


// Adding inventory for a product
add = () =>

    inquirer.prompt([
        {
            // asking for item_id
            name: "addInv",
            message: "What is the item_id that you would like to add more inventory?",
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    console.log("\nitem_ID must be a number");
                }
            }
        },
        {
            // asking how much to add
            name: "amount",
            message: "How much would you like to add?",
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    console.log("\nAmount added must be a number");
                }
            }
        }
    ]).then((answer) => {
        let more = answer.addInv;
        let amount = answer.amount;
        // creating the selection to grab from
        conn.query("SELECT product_name, item_id, stock_quantity FROM products WHERE ?", { item_id: more }, (err, res) => {
            if (err) throw err;
            // increasing the stock quantity
            let newStock = res[0].stock_quantity + amount;
            // Putting the new Stock into the database
            conn.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newStock
                    },
                    {
                        item_id: more
                    }
                ])
            console.log(`You have added ${amount} of stock to item_id ${more}, ${res[0].product_name}, so that it now has a total of ${newStock}`);
            menu();
        })
        // Displaying the new amount to the user

    })


session = () => {
    conn.end();
}