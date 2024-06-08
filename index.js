const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const server = require('http').createServer(app);
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./connection/connection');
app.use(bodyParser.json());


app.use(cors(corsOptions));




// const upload = multer({ dest: 'uploads/' });

app.use('/user',require('./routes/user'));
app.use('/signup',require('./routes/signup'));
app.use('/enquiry',require('./routes/enquiry'));
app.use('/company',require('./routes/company'));
app.use('/states',require('./routes/states'));
app.use('/product',require('./routes/product'));
app.use('/orders', require('./routes/orders'));
app.use('/userenquiry',require('./routes/userenquiry'));
app.use('/versions',require('./routes/versions'));
app.use('/versionproducts',require('./routes/versionproducts'));
app.use('/reports',require('./routes/reports'));
app.use('/update',require('./routes/updates'));

app.get('/piechartpending', (req, res) => {      //API for home page piechart pending count
  connection.query('SELECT * FROM `enquires` WHERE enquiry_status="pending"', (err, rows) => {
    if (!err) {
      res.json({ count: rows.length, data: rows });
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/piechartaccepted', (req, res) => {      //API for home page piechart accepted count
  connection.query('SELECT * FROM `enquires` WHERE enquiry_status="accepted"', (err, rows) => {
    if (!err) {
      res.json({ count: rows.length, data: rows });
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/piechartcompleted', (req, res) => {
  connection.query('SELECT * FROM `enquires` WHERE enquiry_status="completed"', (err, rows) => {  //API for home page piechart complete count
    if (!err) {
      res.json({ count: rows.length, data: rows });
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/piechartrejected', (req, res) => {
  connection.query('SELECT * FROM `enquires` WHERE enquiry_status="rejected"', (err, rows) => {   //API for home page piechart rejected count
    if (!err) {
      res.json({ count: rows.length, data: rows });
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});


app.get('/contactperson/:contactperson', (req, res) => {   
    const { contactperson } = req.params;   //API for contact person details by contact person name
    // console.log(contactperson);
    connection.query('SELECT * FROM `companies` WHERE `contact_personame`=?', [contactperson], (err, row) => {
        if (!err) {
            res.send(row);
        } else {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});


const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('csvFile'), (req, res) => {  //API for CSV file uploading
  const csvFilePath = req.file.path;
  
  // Delete existing data from the table before inserting new data
  connection.query('DELETE FROM assets', (deleteError, deleteResults) => {
    if (deleteError) {
      console.error('Error deleting existing data:', deleteError);
      res.status(500).send('Error deleting existing data. Please try again later.');
      return;
    }

    // Read and parse the CSV file, then insert new data into the database
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Insert data into the database
        const sql = `INSERT INTO assets (product_id, product_category, sub_productcategory, quantity) VALUES (?, ?, ?, ?)`;
        const values = [row.product_id, row.product_category, row.sub_productcategory, row.quantity]; // Adjust as per your CSV structure

        connection.query(sql, values, (insertError, insertResults, fields) => {
          if (insertError) {
            console.error('Error inserting new data:', insertError);
          }
        });
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        res.send('Assets Updated At Seethammadhara Stock Point');
      });
  });
});

app.post('/Seethammadhara', upload.single('csvFile'), (req, res) => {
  const csvFilePath = req.file.path;                                  //API for CSV file uploading Seethammadhara
  
  // Delete existing data from the table before inserting new data
  connection.query('DELETE FROM seethammadhara', (deleteError, deleteResults) => {
    if (deleteError) {
      console.error('Error deleting existing data:', deleteError);
      res.status(500).send('Error deleting existing data. Please try again later.');
      return;
    }

    // Read and parse the CSV file, then insert new data into the database
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        // Insert data into the database
        const sql = `INSERT INTO seethammadhara (product_id, product_category, sub_productcategory, quantity) VALUES (?, ?, ?, ?)`;
        const values = [row.product_id, row.product_category, row.sub_productcategory, row.quantity]; // Adjust as per your CSV structure

        connection.query(sql, values, (insertError, insertResults, fields) => {
          if (insertError) {
            console.error('Error inserting new data:', insertError);
          }
        });
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        res.send('Assets Updated At Seethammadhara Stock Point');
      });
  });
});

app.get('/enquiryproductcategory', (req, res) => {   //API for Enquiry Products In Inventory System 
  connection.query("SELECT product_category FROM assets ORDER BY product_category ASC", (err, rows) => {
    if (!err) {
      // Format the response data to include both sub-product category and quantity with space
      const options = rows.map(row => ({
        value: row.product_category, // corrected column name here
        label: `${row.product_category}` // corrected column name here
      }));
      res.send(options);
    } else {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  });
});



app.get('/enquiryproduct/:selectdcategory', (req, res) => {   //API for Enquiry Products In Inventory System 
  // console.log(req.params)
  connection.query('SELECT sub_productcategory, quantity FROM assets WHERE product_category="' + req.params.selectdcategory + '" ORDER BY sub_productcategory ASC', (err, rows) => {
    if (!err) {
      // Format the response data to include both sub-product category and quantity with space
      const options = rows.map(row => ({
        value: row.sub_productcategory,
        label: `${row.sub_productcategory} - Quantity: ${row.quantity}`
      }));
      res.send(options);
    } else {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  });
});


app.get('/getcompanies',(req,res)=>{   //API for get all companies deatils
  connection.query('SELECT * FROM `companies`',(err,row)=>{
    if(!err){
      res.send(row)
    }
    else{
      console.log(err)
    }
  })
});


app.get('/getseethamdaraassets',(req,res)=>{  //API for getseethamdaraassets only
  connection.query('SELECT * FROM `seethammadhara`',(err,row)=>{
    if(!err){
      res.send(row)
    }
    else{
      console.log(err)
    }
  })
});

app.get('/getenquiryproduct',(req,res)=>{    //API for pedhagantayada only
  connection.query('SELECT * FROM `assets`',(err,row)=>{
    if(!err){
      res.send(row)
    }
    else{
      console.log(err)
    }
  })
});

app.get('/usercompany/:id', (req, res) => {  //API company details for user based on their id
  // console.log(req.params.id);
  connection.query('SELECT * FROM `companies` WHERE user_id="'+req.params.id+'"', (err, row) => {
    if (!err) {
      res.send(row);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/usercompanyedit/:id',(req,res)=>{
  connection.query('SELECT * FROM `companies` WHERE id="'+req.params.id+'"', (err, row) => {
    if (!err) {
      res.send(row);
    } else {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
});



app.use('/documentuploads', express.static('documentuploads'));

app.get('/getupdates/:ern', (req, res) => {
  connection.query('SELECT * FROM `updates` WHERE enquiryreferncenumber = ?', [req.params.ern], (err, rows) => {
      if (!err) {
          res.send(rows);
      } else {
          console.log(err);
          res.status(500).send('Error retrieving updates');
      }
  });
});










server.listen(8000, () => {

    console.log('server running innnnnnn in port 8000 ');


})