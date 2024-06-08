const connection = require('../connection/connection');

const creatVersions = (req, res) => {
  console.log(req.body);
  // var versionid = parseFloat(req.body.vid);
  connection.query('SELECT * FROM `versions` WHERE version_id = ?', [req.body.vid], (err, row) => {
    
      if (err) {
          console.log(err);
           console.log(row)
          return;
      }
     
      if (row.length === 0) {
         
          // If no rows found, insert directly
          var versionid = parseFloat(req.body.vid)
          connection.query('INSERT INTO `versions`(`version_id`, `user_id`, `owner`, `company`, `person`, `gst`, `email`, `number`, `state`, `city`, `source`, `status`, `sector`, `stage`, `date`, `remarks`, `documents`, `ern`, `enquiryreferncenumber`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [versionid, req.body.uid, req.body.enquiuryowner, req.body.company_name, req.body.contact_person, req.body.gst, req.body.contact_email, req.body.contact_number, req.body.state, req.body.city, req.body.enquiry_source, req.body.status, req.body.sector, req.body.stage, req.body.date, req.body.remarks, req.body.documents, req.body.enquiryreferncenumber, req.body.enquiryreferncenumber], (err, row, fields) => {
              if (!err) {
                  res.send("Enquiry_added");
                  console.log("Inserted into versions 1");
              } else {
                  console.log(err);
                  // Handle error
              }
          });
      } else {
          // If rows found, calculate the versionid
          var versionid = parseFloat(req.body.vid) + 0.1;
          connection.query('INSERT INTO `versions`(`version_id`, `user_id`, `owner`, `company`, `person`, `gst`, `email`, `number`, `state`, `city`, `source`, `status`, `sector`, `stage`, `date`, `remarks`, `documents`, `ern`, `enquiryreferncenumber`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [versionid, req.body.uid, req.body.enquiryowner, req.body.company_name, req.body.contact_person, req.body.gst, req.body.contact_email, req.body.contact_number, req.body.state, req.body.city, req.body.enquiry_source, req.body.status, req.body.sector, req.body.stage, req.body.date, req.body.remarks, req.body.documents, req.body.enquiryreferncenumber, req.body.enquiryreferncenumber], (err, row, fields) => {
              if (!err) {
                  res.send("Enquiry_added");
                  console.log("Inserted into versions 2");
              } else {
                  console.log(err);
                  // Handle error
              }
          });
      }
  });
};

const deleteVersions = (req, res) => {
  // console.log(req.params.id);
  
  connection.query('DELETE FROM versions WHERE enquiryreferncenumber = ?', [req.params.id], (err, row, fields) => {
    if (!err) {
      connection.query('DELETE FROM versions_products WHERE enquiryreferncenumber = ?', [req.params.id], (err, row) => {
        if (!err) {
          res.status(200).send("Deleted successfully");
        } else {
          // If there was an error deleting from enquriy_products table, send an error response
          console.error(err);
          res.status(400).send("Unable to delete");
        }
      });
    } else {
      // If there was an error deleting from enquires table, send an error response
      console.error(err);
      res.status(400).send("Unable to delete");
    }
  });
};


const viewVersions = (req, res) => {
    const query = `
    SELECT versions.*, versions_products.products, versions_products.quantity, versions_products.unitprice, versions_products.quantity,
      FROM versions
      JOIN versions_products ON versions.enquiryreferncenumber = versions_products.enquiryreferncenumber
    `;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
      } else {
        // Group products by enquiry reference number
        const groupedResults = results.reduce((acc, curr) => {
          const { enquiryreferncenumber, product, quantity, unitprice, totalprice, ...rest } = curr;
          if (!acc[enquiryreferncenumber]) {
            acc[enquiryreferncenumber] = { ...rest, products: [] };
          }
          acc[enquiryreferncenumber].products.push({ product, quantity, unitprice, totalprice});
          return acc;
        }, {});
        
        // Convert object back to array
        const transformedResults = Object.values(groupedResults);
        // console.log(transformedResults)
        res.json(transformedResults);
      }
    });
  };
  

  

const singleVersions = (req, res) => {
    const query = `
      SELECT versions.*, versions_products.products, versions_products.quantity, versions_products.unitprice,versions_products.totalprice
      FROM versions
      JOIN versions_products ON versions.enquiryreferncenumber = versions_products.enquiryreferncenumber
      WHERE versions.user_id = ${req.params.id};
    `;
    // console.log(req.params.id);
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
      } else {
        // Group products by enquiry reference number
        const groupedResults = results.reduce((acc, curr) => {
          const { enquiryreferncenumber, products, quantity,unitprice,totalprice, ...rest } = curr;
          if (!acc[enquiryreferncenumber]) {
            acc[enquiryreferncenumber] = { ...rest, products: [] };
          }
          acc[enquiryreferncenumber].products.push({ products, quantity,unitprice,totalprice });
          return acc;
        }, {});
        
        // Convert object back to array
        const transformedResults = Object.values(groupedResults);
        
        res.json(transformedResults);
      }
    });
  };
  

module.exports = {creatVersions,deleteVersions,viewVersions,singleVersions};