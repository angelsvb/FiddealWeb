'use strict';

//carrega de moduls
var mongoose = require("mongoose");
var app = require("./app");
var manager = require('./utilities/manager');
var texts = require('./utilities/texts');

//Conexió i treballa amb promeses
mongoose.Promise = global.Promise;
let options = {
    user: manager.db_user,
    pass: manager.db_pwd,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
};

mongoose.connect(manager.dbURL,options).then(() => {
        // Cuando se realiza la conexión, lanzamos este mensaje por consola
        console.log(texts.label_connected_to_db);
        // CREAR EL SERVIDOR WEB CON NODEJS
        app.listen(manager.server_port, () => {
            console.log(texts.label_connected_to_server);
        });
    })
    // Si no se conecta correctamente escupimos el error
    .catch(err => console.log(err));