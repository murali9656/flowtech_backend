const mysql = require('mysql');

const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'flowtech'
    })

connection.connect((err) => {
    if (!err) {
        console.log('database connected successfully')
    }
    else {
        console.log('connection failed pls check');
        console.log(err)
    }
}
)

module.exports = connection;
