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

function listProducts() {
    connection.query("SELECT * FROM cheeses", function (err, res) {
        if (err) throw err;
        console.log(`-------------------------------------------------------------`);
        console.log(`             🧀 Glorious Cheeses of the World 🧀             `);
        console.log(`-------------------------------------------------------------`);
        for (let i=0; i<res.length; i++) {
            console.log(`\n🧀 ${res[i].product_name} (Glorious), Country of Origin: ${res[i].department_name}
            Id: ${res[i].item_id}, Cost per Unit (USD): ${res[i].price}`);
        };
        exit();
        
    });
};

function exit() {
    console.log(`\n`);
    inquirer.prompt([
        {
            type: "list",
            message: "Order Glorious Cheeses or Exit the Glorious Cheese Shoppe?",
            choices: ["Order","Exit"],
            name: "exit"
        }
    ]).then(function (response) {
        if ( response.exit == "Exit") {
            connection.end();
        }
        else if (response.exit == "Order") {
            order();
        }
    })
}

function order() {
    console.log(`\n----------------------------------------------------------🐁`);
    console.log(`                   🧀 Place an Order 🧀                    `);
    console.log(`------------------------------------------------------------`);
    inquirer.prompt([
        {
            type: "input",
            message: "Cheese id number: ",
            name: "id"
        },
        {
            type: "input",
            message: "Number of units: ",
            name: "number"
        }
    ]).then(function (response) {
        var selectedId = response.id;
        var selectedNumber = response.number;
        var queryString = "select * from cheese_db.cheeses where `item_id` = " + selectedId; 

        function checkInventory() {
            connection.query(queryString, function (err, res) {
                if (err) throw err;

                var selectedCheese = res[0].product_name;
                var selectedDepartment = res[0].department_name;
                var selectedUnitPrice = res[0].price;
                var selectedInventoryQuantity = res[0].stock_quantity;

                if (selectedInventoryQuantity < selectedNumber) {
                    console.log(`------------------------------------------------------------`);
                    console.log(`\nOpe, sorry!\nNot enough Glorious ${selectedCheese} to fulfill your decadent tastes.`);
                    return exit();
                };

                var customerCost = selectedNumber * selectedUnitPrice;
                console.log(`------------------------------------------------------------`);
                console.log(`Your total for ${selectedNumber} unit(s) of Glorious ${selectedCheese} from ${selectedDepartment} is:\nUSD ${customerCost}`)
                console.log(`------------------------------------------------------------`);
                
                inquirer.prompt([
                    {
                        type: "confirm",
                        message: "Place order?",
                        name: "confirm"
                    }
                ]).then(function (response) {
                    if (response.confirm) {
                        console.log(`------------------------------------------------------------`);
                        console.log(`                  🧀 Thine be the Glory 🧀                   `);
                        console.log(`----------------------------------------------------------🐈`);
                        exit();
                    }
                    else {
                        console.log(`\nYou may not have to buy our Glorious Cheeses...
                               but you still can't buy taste.`);
                        exit();
                    };
                });
            });
        };
        checkInventory();
    });
};

//Calls
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    listProducts();
});
