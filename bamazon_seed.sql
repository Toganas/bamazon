CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL (10,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES 
("PlayStation 4", "Electronic Gaming", 399.99, 50), 
("Mice and Mystics", "Board Games", 79.99, 10),
("Aeon's End", "Board Games", 49.99, 30),
("Black Cherry Bottled Water", "Drink", 0.57, 117),
("Pandemic", "Board Games", 59.99, 12),
("Black Paint", "Hobbies", 5.49, 300),
("Magenta Paint", "Hobbies", 5.49, 243),
("Assassin's Creed: Origins", "Video Games", 59.99, 25),
("Rainbow Six: Siege", "Video Games", 19.99, 3),
("FitBit Charge 3", "Fitness Tracker", 149.99, 22),
("Logitech MX 350 Mouse", "Computer Accessories", 34.99, 10)