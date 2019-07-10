const mysql = require ("mysql");
const inquirer = require ("inquirer");

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
    purchase();
});

purchase = () => {
    inquirer.prompt([
        {
            name: "productID",
            message: "What is the ID of the product you would like to purchase?",
            validate: (value) =>{
                if (isNaN(value) === false){
                    return true;
                } else {
                    console.log("\nProduct ID's must be a number");
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
        let product = buying.productID;
        console.log(product);
        // let amount = buying.amount;
        // let sql = "SELECT * FROM products WHERE product = ?"
        // conn.query(sql, product, (err,res) => {
        //     if (err) throw err;
        //     console.table(res);
        // })

    })
    conn.end();
}