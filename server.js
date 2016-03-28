var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose= require('mongoose');
var cors = require('cors');
var router = express.Router();
var port = process.env.PORT || 8000;

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

require('./app/routes.js')(router);

app.use('/api', router);

app.listen(port);
console.log('Maggic happen on port ' + port);
