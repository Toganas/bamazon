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
});