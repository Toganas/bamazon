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
            name: "options",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then((res) => {
        switch (res.options) {
            // Sending user to the prompt to view products for sale
            case "View Products for Sale":
                sale();
            // Sending user to the prompt to view low inventory
            case "View Low Inventory":
                low();
            // Sending user to the prompt to add inventory
            case "Add to Inventory":
                add();
            // Sending user to the prompt to add a product
            case "Add New Product":
                product();
        }
    })
}

sale = () => {
    conn.query("SELECT product_name, department_name, price, stock_quantity FROM products", (err,res)=>{
        if(err) throw err;
        console.table(res)
    })
}