const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const PORT = process.env.PORT;
const DB = process.env.DATABASE;

// Register user schema
require('./models/user');
require('./models/company');

// to remove the warnings related to useNewUrlParser and useUnifiedTopology
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('connected to mongo!');
});

mongoose.connection.on('error', () => {
    console.log('error connecting to mongo!', err);
});

// recognize the incoming req obj as json
app.use(express.json());
// recognize the incoming req obj as string of arrays
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Register authentication route
app.use(require('./routes/auth'));
app.use(require('./routes/user'));
app.use(require('./routes/company'));

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});