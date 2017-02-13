var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('inventory');
db.bind('order');

var service = {};

service.create = create;
service.get = get;
service.createOrder = createOrder;
service.getOrder = getOrder;
service.updateOrder = updateOrder;
service.deleteOrder = deleteOrder;

module.exports = service;

function create(inventoryData) {
    var deferred = Q.defer();
    createInventory();
    function createInventory() {
        db.inventory.insert(
            inventoryData,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                console.log('documents are ', doc);
                deferred.resolve();
            });
    }
    return deferred.promise;
}

function get(un) {
    var deferred = Q.defer();
    db.inventory.find({username: un}).toArray(function (err, data) {
         if (err) deferred.reject(err.name + ': ' + err.message);
         deferred.resolve(data);
    });
    return deferred.promise;
}

function createOrder(orderData) {
    var deferred = Q.defer();
    createOrder();
    function createOrder() {
        db.order.insert(
            orderData,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                console.log('documents are ', doc);
                deferred.resolve();
            });
    }
    return deferred.promise;
}

function getOrder(un) {
    var deferred = Q.defer();
    db.order.find({username: un}).toArray(function (err, data) {
         if (err) deferred.reject(err.name + ': ' + err.message);
         deferred.resolve(data);
    });
    return deferred.promise;
}

function updateOrder(un) {
    var deferred = Q.defer();
    db.order.find({username: un}).toArray(function (err, data) {
         if (err) deferred.reject(err.name + ': ' + err.message);
         deferred.resolve(data);
    });
    return deferred.promise;
}

function deleteOrder(data) {
    var deferred = Q.defer();
    db.order.remove({username: data.username, order_id: data.order_id}, function (err, data) {
         if (err) deferred.reject(err.name + ': ' + err.message);
         deferred.resolve(data);
    });
    return deferred.promise;
}

function updateOrder(data) {
    var deferred = Q.defer();
    db.order.update({username: data.username, order_id: data.order_id}, data,  function (err, data) {
         if (err) deferred.reject(err.name + ': ' + err.message);
         deferred.resolve(data);
    });
    return deferred.promise;
}

