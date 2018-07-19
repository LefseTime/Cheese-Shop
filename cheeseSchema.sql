CREATE DATABASE cheese_db;

USE cheese_db;

CREATE TABLE cheeses(
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100),
  department_name VARCHAR(100),
  price FLOAT(3,2),
  stock_quantity INT,
	
  PRIMARY KEY (item_id)
);
