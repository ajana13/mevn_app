const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const { ppid } = require('process');
const passport = require('passport');

// Initialize App
const app = express();

// Middlewares
// Formdata
app.use(bodyParser.urlencoded({
    extended: false
}));
// Json body
app.use(bodyParser.json());
// CORS
app.use(cors());
// Use Passport 
app.use(passport.initialize());
// Bring in the strategy
require('./config/passport')(passport);

// Path
// Setting up static directory
app.use(express.static(path.join(__dirname, 'public')));

// Import the DB config anf connect
const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true }).then(() => {
    console.log(`Database connected Successfully ${db}`);
}).catch(err => {
    console.log(`Unable to connect with the database ${err}`);
});


// app.get('/', (req, res) => {
//     return res.send("<h1>Hello World</h1>")
// });

// Bring in the Users route 
const users = require('./routes/api/users');
app.use('/api/users', users);

// any other request, send it to index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});