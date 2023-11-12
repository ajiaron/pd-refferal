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

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const verifySid = process.env.VERIFY_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

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
app.get('/api/checkreferral', (req, res) => {
    const referralToken = req.query.referralToken
    db2.query('SELECT phone, COUNT(referral_link) as isValid FROM users WHERE referral_link = ?',
    [referralToken], (err, result) => {
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
    const from = req.body.token
    const referral = uuidv4()
    var numb = phone.match(/\d/g);
    numb = numb.join("");
    // might wanna set `confirmed` here, after verifying phone thru twilio
    const sql = `INSERT INTO users (userid, phone, referral_link, from) VALUES (?, ?, ?, ?)`
    db2.query(sql, [userid, numb, referral, from], (err, result) => {
        if(err) {
            console.log(err)
        } else {
            res.json({referral: referral});
        }
    })
})
app.get('/api/getreferralcount', (req, res) => {
    const phone = req.query.phone
    var numb = phone.match(/\d/g);
    numb = numb.join("");
    db2.query(`SELECT COUNT(DISTINCT recipient_phone) as count FROM referrals WHERE owner_phone = ?`, [numb], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})
app.post('/api/countreferral', (req, res) => {
    const referralid = req.body.referral
    const recipientPhone = req.body.recipientPhone
    var recipientNumb = recipientPhone.match(/\d/g);
    recipientNumb = recipientNumb.join("");
    // might wanna set `confirmed` here, after verifying phone thru twilio
    const sql = `INSERT INTO referrals (referralid, owner_phone, recipient_phone) VALUES (?, ?, ?)`

    db2.query(`SELECT DISTINCT phone as owner_phone FROM users WHERE referral_link = ?`, [referralid], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result[0].owner_phone) {
                const ownerPhone = result[0].owner_phone
                var ownerNumb = ownerPhone.match(/\d/g);
                ownerNumb = numb.join("");   
                db2.query(sql, [referralid, ownerNumb, recipientNumb], (err, result) => {
                    if(err) {
                        console.log(err)
                    } else {
                        // just return the same referral link for now
                        res.json({referral: referralid});
                    }
                })
            } else {
                res.json({referral:false})
            }
          
        }
    })

})
app.post('/api/send-sms', (req, res) => {
    const phone = req.body.phone
    var numb = phone.match(/\d/g);
    numb = numb.join("");
    const to = `+1${numb}`
    const code = Math.floor(100000 + Math.random() * 900000)
    const from = "+18445900274";
    const body = `Reply with YES ${code}`;
    const id = uuidv4()
    client.messages
      .create({ body, from, to })
      .then(message => res.send({ message: 'SMS sent', sid: message.sid }))
      .catch(error => res.status(500).send({ error }));
    db2.query('INSERT INTO codes (codeid, code, phone) VALUES (?,?,?)', [id, code, numb], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))