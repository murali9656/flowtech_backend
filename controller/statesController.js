const connection = require('../connection/connection');

const getRecord = (req, res) => {
    connection.query("SELECT DISTINCT state AS value, state AS label FROM states ORDER BY state ASC", (err, row) => {
        if (!err) {
            res.send(row);
        } else {
            console.log(err);
            res.status(500).send("Internal server error");
        }
    });
};

const getCity = (req, res) => {
    let { state } = req.params; // Correct parameter name
    // console.log(state);
    connection.query('SELECT DISTINCT city AS value, city AS label FROM states WHERE state=? ORDER BY city ASC', [state], (err, row) => {
        if (!err) {
            res.send(row);
        } else {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};
module.exports = {getRecord,getCity};
