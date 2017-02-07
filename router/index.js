module.exports = function(app) {
    
    var inventoryService = require('services/inventory.service');
    
    app.post('/api/inventory/:data', function (req, res) {
        var inventoryData = JSON.parse(req.params.data);
        inventoryService.create(inventoryData).then(function(response) {
            res.send('data inserted successfully');
        });
    });
    
    app.get('/api/inventory/get/:username', function(req, res) {
        var inventoryData = req.params.username;
        console.log('inventory data', inventoryData);
        inventoryService.get(inventoryData).then(function(response) {
            console.log('data response is ', response);
            res.send(response);
        });
    });

     app.post('/api/order/:data', function (req, res) {
        var orderData = JSON.parse(req.params.data);
        inventoryService.createOrder(orderData).then(function(response) {
            res.send('data inserted successfully');
        });
    });

    app.get('/api/order/get/:username', function(req, res) {
        var orderData = req.params.username;
        console.log('inventory data', orderData);
        inventoryService.getOrder(orderData).then(function(response) {
            console.log('data response is ', response);
            res.send(response);
        });
    });


}