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
const db2 = mysql.createConnection({
    user: 'admin',
    host: 'referraldb.cxqytlywk8uc.us-west-1.rds.amazonaws.com',
    password: 'Claypot123!',
    charset: 'utf8mb4',
    database: 'referralDB',
});

app.get('/api/getusers', (req,res)=> {
    db2.query('SELECT DISTINCT * FROM users ORDER BY date DESC', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getreferrals', (req,res)=> {
    db2.query('SELECT DISTINCT * FROM referrals ORDER BY date DESC', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/getlinks', (req,res)=> {
    db2.query('SELECT DISTINCT * FROM links ORDER BY date DESC', (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.get('/api/checkexists', (req,res)=> {
    const phone = req.query.phone
    var numb = phone.match(/\d/g);
    numb = numb.join("");
    db2.query('SELECT COUNT(DISTINCT phone) as isRegistered FROM users WHERE phone = ?', [numb], (err, result)=> {
        if (err) {
            console.log(err)
        } else {
            if (result[0].isRegistered) {
                db2.query('SELECT DISTINCT referral_link as referral FROM users WHERE phone = ?', [numb], (err, result)=> {
                    if (err) {
                        console.log(err)
                    } else {
                        res.send(result)
                    }
                })
            } else {
                res.json({referral: false});
            }
        }
    })
})
app.post('/api/createuser', (req, res) => {
    // id not really needed, phone is main identifier
    const userid = uuidv4()
    // gotta do input validation on phone numbers
    const phone = req.body.phone
    const referral = uuidv4()
    var numb = phone.match(/\d/g);
    numb = numb.join("");
    // might wanna set `confirmed` here, after verifying phone thru twilio
    const sql = `INSERT INTO users (userid, phone, referral_link) VALUES (?, ?, ?)`
    db2.query(sql, [userid, numb, referral], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.json({referral: referral});
        }
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))