const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const movieRoutes = require('./routes/movie');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
console.log(process.env.DATABASE);
console.log(process.env.PORT);

app.use(bodyParser.json());

// Routes
app.use('/api', movieRoutes);

// Connecting to mongo
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// checking connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error of database:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
