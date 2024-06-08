const connection = require('../connection/connection');


const createUpdate=(req,res)=>{
    const filename = req.file.filename;

    const { referncenumber, date, update } = JSON.parse(req.body.details);

    const query = 'INSERT INTO `updates` (`file`, `enquiryreferncenumber`, `date`, `update`) VALUES (?, ?, ?, ?)';
      connection.query(query, [filename, referncenumber, date, update], (err, result) => {
        if (!err) {
          res.send('Updated');
        } else {
          console.error(err);
          res.status(500).send('Internal Server Error');
        }
      });
}


const getUpdate=(req,res)=>{
    connection.query('SELECT * FROM `updates`',(err,row)=>{
            if(!err){
              res.send(row)
        
            }
            else{
              console.log(err)
            }
          })
}

const deleteUpdate = (req, res) => {
  const id = req.params.id;

  connection.query('DELETE FROM `updates` WHERE id = ?', [id], (err, result) => {
      if (err) {
          console.error('Error deleting update:', err);
          res.status(500).send('Server error');
          return;
      }

      if (result.affectedRows === 0) {
          res.status(404).send('Update not found');
          return;
      }

      res.send('Update deleted successfully');
  });
};


module.exports = {createUpdate,getUpdate,deleteUpdate};