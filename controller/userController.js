const express = require("express");
const app = express();
app.use(express.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../connection/connection');

const userLogin = (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    const sql = "SELECT * FROM `usersdata` WHERE  email=? ";
    connection.query(sql, [email], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const user = result[0];
            bcrypt.compare(password, user.password, (err, match) => {
                if (err) throw err;
                if (match) {
                    const token = jwt.sign({ name: user.name }, "this is my jwt token for authentication for login and logout", { expiresIn: '1d' });
                    res.cookie('token', token, { httpOnly: true });
                    return res.json({ Status: "success", "userdetails": user.username,"id":user.id,"role":user.role });
                
                  
                } else {
                    return res.status(401).send('Invalid password');
                }
            });
        } else {
            return res.status(401).send('Invalid email or password');
        }
    });
};



const userDelete = (req,res) =>{
    console.log(req.params.id)
    connection.query('delete  from  `users` where id="' + req.params.id + '"', (err, row, fields) => {

        if (!err) {
            res.send(row)
        }
        else {
            res.send(err)
        }


    })
}

module.exports = { userLogin,userDelete };