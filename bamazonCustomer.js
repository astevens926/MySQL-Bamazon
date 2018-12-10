var inquirer = require('inquirer');
var connection = require('./connection');


connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        console.log(results);
        inquirer.prompt([
            {
                name: 'id',
                type: 'input',
                message: 'Enter the Id of the product you want.'
            },
            {
                name: 'quantity',
                type: 'input',
                message: 'Enter the quantity of the product you want.'
            }
        ]).then(function (choice) {
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id == choice.id) {
                    chosenItem = results[i];
                }
            }
            if (chosenItem.stock_quantity >= choice.quantity){
                console.log("Total cost: $" + chosenItem.price * choice.quantity);
                var newStock = chosenItem.stock_quantity - choice.quantity;
                connection.query("UPDATE products SET stock_quantity = " + newStock + " WHERE item_id = " + choice.id);
                connection.end();
            }
            else {
                console.log("Insufficient quantity!");
                connection.end();
            }
        })
    })
};