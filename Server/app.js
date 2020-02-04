'use strict';

let express = require('express');
let bodyParser = require('body-parser');

//Es crida express per poder crear el servidor
let app = express();
let path = require('path');

//Importació de les rutes
let user_routes = require("./routes/user");
let countries_routes = require("./routes/countries");
let support_routes = require("./routes/support");
let login_routes = require('./routes/login');
let activation_routes = require('./routes/user_activation');
let credentials_routes = require('./routes/user_credentials');
let categories_routes = require('./routes/product_categories');
let schedule_routes = require('./routes/schedule');
let fidelization_routes = require('./routes/fidelization_params');
let product_routes = require('./routes/products');
let offers_routes = require('./routes/offers');
let fidelization_discount_routes = require('./routes/fidelization_discounts');
let purchases_routes = require('./routes/purchases');
let newsletter_routes = require('./routes/newsletter');
let commons = require('./utilities/common_responses');


//Enable CORS headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

//Cárrega de middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use((err,req,res,next) => {
    if (err.status === 400) return commons.invalidJSON(res);
    else if (err.status === 404) return commons.unexpectedRequest(res);
    else next(err);
});

app.use(function(req, res, next){
    if (typeof req.body === 'string' && req.body) req.body = JSON.parse(req.body);
    next();
});


//Càrrega de les rutes
app.use("/api",user_routes);
app.use("/api",countries_routes);
app.use("/api",support_routes);
app.use("/api",login_routes);
app.use("/api",activation_routes);
app.use("/api",credentials_routes);
app.use("/api",categories_routes);
app.use("/api",schedule_routes);
app.use("/api",fidelization_routes);
app.use("/api",product_routes);
app.use("/api",offers_routes);
app.use("/api",fidelization_discount_routes);
app.use("/api",purchases_routes);
app.use("/api", newsletter_routes);
app.use(express.static(path.join(__dirname, 'images')));

//Exportar el modul per poder-lo fer servir fora de l'arxiu
module.exports = app;
