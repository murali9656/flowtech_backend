const connection = require('../connection/connection');
const bcrypt = require("bcrypt");

const createRecord = (req, res) => {
    var value = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error('Error generating salt:', err);
            return res.status(500).send('Internal Server Error');
        }

        bcrypt.hash(value, salt, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Internal Server Error');
            }

            var data = {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role
            }

            connection.query('SELECT * FROM `usersdata` WHERE email=?', [req.body.email], (err, rows) => {
                if (!err && rows.length > 0) {
                    res.send("User Already Exists With This Email....")
                } else {
                    connection.query('INSERT INTO `usersdata` SET ?', data, (err, row) => {
                        if (!err) {
                            res.send("Account Added Successfully......")
                        } else {
                            console.error(err);
                            res.status(500).send('Internal Server Error');
                        }
                    })
                }
            })
        });
    });
}

module.exports = { createRecord };
