const connection = require('../connection/connection');

const getRecord=(req,res)=>{
       connection.query('SELECT * FROM `assets`',(err,row)=>{
        if(!err){
            res.send(row)
        }
        else{
            console.log(err)
        }
       })
};


module.exports = {getRecord};