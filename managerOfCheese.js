//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

//Functions and Friends
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "cheese_db"
});

function menu() {
    console.log(`\n`);
    inquirer.prompt([
        {
            type: "list",
            message: "View Glorious Cheeses for Sale, View Low Inventory, Add to Inventory, Add New Glorious Cheese, or Exit?",
            choices: ["View for Sale", "View Low Inventory", "Add Inventory", "Add New", "Exit"],
            name: "menuChoice"
        }
    ]).then(function (response) {
        if (response.menuChoice == "Exit") {
            connection.end();
        }
        else if (response.menuChoice == "View for Sale") {
            listProducts();
        }
        else if (response.menuChoice == "View Low Inventory") {
            listLow();
        }
        else if (response.menuChoice == "Add Inventory") {
            addInventory();
        }
        else if (response.menuChoice == "Add New") {
            addNew();
        }
    })
}

function listProducts() {
    connection.query("SELECT * FROM cheeses", function (err, res) {
        if (err) throw err;
        console.log(`\n-------------------------------------------------------------`);
        console.log(`             🧀 Glorious Cheeses of the World 🧀             `);
        console.log(`                  FOR MANAGERS EYES ONLY                     `);
        console.log(`-------------------------------------------------------------`);
        for (let i = 0; i < res.length; i++) {
            console.log(`\n🧀 ${res[i].product_name} (Glorious), Country of Origin: ${res[i].department_name}
    Id: ${res[i].item_id}, Cost per Unit (USD): ${res[i].price}, Inventory Quantity: ${res[i].stock_quantity}`);
        };
        menu();
    });
};

function listLow() {
    connection.query("SELECT * FROM cheeses", function (err, res) {
        if (err) throw err;
        console.log(`\n-------------------------------------------------------------`);
        console.log(`                      🧀 Low Inventory 🧀             `);
        console.log(`                          TOP SECRET                     `);
        console.log(`-------------------------------------------------------------`);
        for (let i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(`\n🧀 ${res[i].product_name} (Glorious), Country of Origin: ${res[i].department_name}
    Id: ${res[i].item_id}, Cost per Unit (USD): ${res[i].price}, Inventory Quantity: ${res[i].stock_quantity}`);
            };
        }
        menu();
    });
};

function addInventory() {
    console.log(`\n-------------------------------------------------------------`);
    console.log(`                      🧀 Add Inventory 🧀             `);
    console.log(`                     DOING THE LORD'S WORK                     `);
    console.log(`-------------------------------------------------------------`);
    inquirer.prompt([
        {
            type: "input",
            message: "Cheese id number: ",
            name: "id"
        },
        {
            type: "input",
            message: "Number of units to add: ",
            name: "numberAdded"
        }
    ]).then(function (response) {

        var updateId = response.id;
        var numberAdded = response.numberAdded;
        var queryString = "SELECT * FROM cheeses WHERE item_id=" + updateId;

        connection.query(queryString, function (err, res) {
            if (err) throw err;
            var currentStock = res[0].stock_quantity;
            var updatedNumber = parseInt(numberAdded) + parseInt(currentStock);

            connection.query(
                "UPDATE cheeses SET ? WHERE ?",
                [
                    {
                        stock_quantity: updatedNumber
                    },
                    {
                        item_id: updateId
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(`\n-------------------------------------------------------------`);
                    console.log(`                       DID THE LORD'S WORK                     `);
                    console.log(`-------------------------------------------------------------`);
                    menu();
                }
            );
        });
    });
};

function addNew () {
    console.log(`\n-------------------------------------------------------------`);
    console.log(`                                ✨✨✨✨✨✨                      `);
    console.log(`                      🧀 Add New Glorious Cheese 🧀             `);
    console.log(`                                ✨✨✨✨✨✨                       `);
    console.log(`-------------------------------------------------------------`);
    inquirer.prompt([
        {
            type: "input",
            message: "Cheese name: ",
            name: "name"
        },
        {
            type: "input",
            message: "Country of Origin: ",
            name: "country"
        },
        {
            type: "input",
            message: "Price per Unit (USD): ",
            name: "price"
        },
        {
            type: "input",
            message: "Inventory quantity: ",
            name: "inventory"
        }
    ]).then(function (response) {

        var newName = response.name;
        var newCountry = response.country;
        var newPrice = response.price;
        var newInventory = response.inventory;

        connection.query(
            "INSERT INTO cheeses SET ?",
            {
              product_name: newName,
              department_name: newCountry,
              price: newPrice,
              stock_quantity: newInventory
            },
            function (err, res) {
              console.log(res.affectedRows + " product inserted!\n");
              menu();
            }
        );
    });
};

menu();