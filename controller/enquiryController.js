const connection = require('../connection/connection');
const creatEnquiry = (req,res) =>{
    console.log(req.body);

    connection.query('INSERT INTO `enquires`(`user_id`,`enquiury_owner`, `company_name`, `contact_person`, `gst`, `contact_email`, `contact_number`,`state`, `city`, `enquiry_source`, `enquiry_status`, `sector`, `stage`, `expected_order`, `remarks`, `documents`,`ern`, `enquiryreferncenumber`) VALUES ("'+req.body.id+'","' + req.body.enqruirowner + '","' + req.body.company_name + '","' + req.body.contact_person + '","' + req.body.gst + '","' + req.body.contactemail+ '","' + req.body.contactnumber + '","' + req.body.state + '","' + req.body.city + '","' + req.body.source + '","' + req.body.status + '","' + req.body.sector + '","' + req.body.stage + '","' + req.body.date + '","' + req.body.remarks + '","' + req.body.referenceNumber + '" ,"' + req.body.referenceNumber + '","'+req.body.referenceNumber+'")', (err, row, fields) => {

        if (!err) {
            res.send("Enquiry_added")
        }
        else {
            // res.send(err)
            console.log(err)
        }


    })
    
}


const updateEnquiry = (req,res) => {

    connection.query('update  `enquires` set company_name ="' + req.body.company_name + '", gst ="' + req.body.gst + '",contact_person ="' + req.body.contact_person + '", contact_number ="' + req.body.contact_number + '",	contact_email ="' + req.body.contact_email + '",state ="' + req.body.state + '", city ="' + req.body.city + '", enquiry_source ="' + req.body.enquiry_source + '", sector ="' + req.body.sector + '", stage ="' + req.body.stage + '", expected_order ="' + req.body.expected_order + '" , enquiry_status ="' + req.body.status + '",remarks ="' + req.body.remarks + '"  where id="' + req.params.id + '"', (err, row, fields) => {


        if (!err) {
            res.send("updated")
        }
        else {
          console.log(err);
          res.send("rejected")
        }


    })
}

const deleteEnquiry = (req, res) => {
  // console.log(req.params.id);
  
  connection.query('DELETE FROM enquires WHERE enquiryreferncenumber = ?', [req.params.id], (err, row, fields) => {
    if (!err) {
      connection.query('DELETE FROM enquriy_products WHERE enquiryreferncenumber = ?', [req.params.id], (err, row) => {
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


const viewEnquiry = (req, res) => {   
    const query = `
      SELECT enquires.*, enquriy_products.product, enquriy_products.quantity
      FROM enquires
      JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber;
    `;
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error fetching data');
      } else {
        // Group products by enquiry reference number
        const groupedResults = results.reduce((acc, curr) => {
          const { enquiryreferncenumber, product, quantity, ...rest } = curr;
          if (!acc[enquiryreferncenumber]) {
            acc[enquiryreferncenumber] = { ...rest, products: [] };
          }
          acc[enquiryreferncenumber].products.push({ product, quantity });
          return acc;
        }, {});
        
        // Convert object back to array
        const transformedResults = Object.values(groupedResults);
        // console.log(transformedResults)
        res.json(transformedResults);
      }
    });
  };
  

const singleEnquiry = (req, res) => {
    const query = `
      SELECT enquires.*, enquriy_products.product, enquriy_products.quantity, enquriy_products.unitprice,totalprice
      FROM enquires
      JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
      WHERE enquires.id = ${req.params.id};
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
          acc[enquiryreferncenumber].products.push({ product, quantity, unitprice, totalprice });
          return acc;
        }, {});
        
        // Convert object back to array
        const transformedResults = Object.values(groupedResults);
        
        res.json(transformedResults);
      }
    });
  };
  

    // connection.query('select * from  `enquires` where id="' + req.params.id + '"',(err,row)=>{
    //     if(!err){
    //         res.send(row)
    //     }
    //     else{
    //         console.log(err)
    //     }
    // })


module.exports = {creatEnquiry,updateEnquiry,deleteEnquiry,viewEnquiry,singleEnquiry};

