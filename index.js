const express = require('express');
const cookieParser = require('cookie-parser')
require('dotenv').config();

const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');


const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 9001;

// mongodb+srv://admin:admin123@cluster0.3rtvu1l.mongodb.net/Capstone2
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error"));
db.once('open', () => console.log("Connected to MongoDB"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
}));
app.use(cookieParser({}));
app.use((req, res, next) => {
    //for cookies
    res.setHeader('Access-Control-Allow-Origin', 'https://shopyy-front.vercel.app');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, *');
    next();
});

app.get('/', (req, res)=> {
    res.send("Welcome to Shopyy backend"); 
});

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/images', express.static('uploads'));



app.listen(port, () => console.log(`Server is running on localhost: ${port}`))

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//     next();
// });