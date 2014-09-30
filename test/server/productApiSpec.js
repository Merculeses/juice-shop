/*jslint node: true */

var frisby = require('frisby');

var API_URL = 'http://localhost:3000/api';
var REST_URL = 'http://localhost:3000/rest';

frisby.create('GET all products')
    .get(API_URL + '/Products')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('data.*', {
        id: Number,
        name: String,
        description: String,
        price: Number,
        image: String
    })
    .afterJSON(function (products) {
        frisby.create('GET product search with empty search parameter returns all products')
            .get(REST_URL + '/product/search?q=')
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSONLength('data', products.data.length)
            .toss();
        frisby.create('GET product search without search parameter returns all products')
            .get(REST_URL + '/product/search')
            .expectStatus(200)
            .expectHeaderContains('content-type', 'application/json')
            .expectJSONLength('data', products.data.length)
            .toss();
    })
    .toss();

frisby.create('GET existing user by id')
    .get(API_URL + '/Products/1')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONTypes('data', {
        id: Number,
        name: String,
        description: String,
        price: Number,
        image: String,
        createdAt: String,
        updatedAt: String
    })
    .expectJSON('data', {
        id: 1
    })
    .toss();

frisby.create('GET non-existing product by id')
    .get(API_URL + '/Products/4711')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSON('data', {})
    .toss();

frisby.create('GET product search with no matches returns no products')
    .get(REST_URL + '/product/search?q=nomatcheswhatsoever')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONLength('data', 0)
    .toss();

frisby.create('GET product search with one match returns found product')
    .get(REST_URL + '/product/search?q=apple')
    .expectStatus(200)
    .expectHeaderContains('content-type', 'application/json')
    .expectJSONLength('data', 1)
    .toss();

frisby.create('POST new product is forbidden via public API')
    .post(API_URL + '/Products', {
        name: 'Raspberry Juice (1000ml)',
        description: "Made from blended Raspberry Pi, water and sugar.",
        price: 4.99,
        image: 'raspberry_juice.jpg'
    })
    .expectStatus(401)
    .toss();

frisby.create('PUT update existing product is forbidden via public API')
    .put(API_URL + '/Products/1', {
        description: "Made from blended raspberries, water and sugar."
    })
    .expectStatus(401)
    .toss();

frisby.create('DELETE existing product is forbidden via public API')
    .delete(API_URL + '/Products/1')
    .expectStatus(401)
    .toss();
