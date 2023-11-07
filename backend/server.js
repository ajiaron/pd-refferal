require('dotenv').config()
const express = require('express');
const app = express();
const mysql = require('mysql')
const cors = require('cors')
const axios = require('axios');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
app.use(express.json())
app.use(cors())
const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    charset:'utf8mb4',
    database:'refferalDB',
    password:'password'
 }
)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))