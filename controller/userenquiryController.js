const connection = require('../connection/connection');
const creatEnquiry = (req,res) =>{
    // console.log(req.body);

    connection.query('INSERT INTO `enquires`(`enquiury_owner`, `company_name`, `contact_person`, `gst`, `contact_email`, `contact_number`,`territory`,`state`, `city`, `enquiry_source`, `enquiry_status`, `sector`, `stage`, `expected_order`, `remarks`, `documents`,`ern`, `enquiryreferncenumber`) VALUES ("' + req.body.enqruirowner + '","' + req.body.company_name + '","' + req.body.contact_person + '","' + req.body.gst + '","' + req.body.contactemail+ '","' + req.body.contactnumber + '","' + req.body.territory + '","' + req.body.state + '","' + req.body.city + '","' + req.body.source + '","' + req.body.status + '","' + req.body.sector + '","' + req.body.stage + '","' + req.body.date + '","' + req.body.remarks + '","' + req.body.referenceNumber + '" ,"' + req.body.referenceNumber + '","'+req.body.referenceNumber+'")', (err, row, fields) => {

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
    console.log(req.body);

    connection.query('update  `enquires` set account_name ="' + req.body.account_name + '", gst ="' + req.body.gst + '",contact_person ="' + req.body.contact_person + '", contactperson_number ="' + req.body.contactperson_number + '",employee_email ="' + req.body.employee_email + '", enquiryreference_number ="' + req.body.enquiryreference_number + '", state ="' + req.body.state + '", city ="' + req.body.city + '", enquiry_source ="' + req.body.enquiry_source + '", sector ="' + req.body.sector + '", stage ="' + req.body.stage + '", enquiry_owner ="' + req.body.enquiry_owner + '", expected_order ="' + req.body.expected_order + '" , enquiry_status ="' + req.body.enquiry_status + '",documents ="' + req.body.documents + '", remarks ="' + req.body.remarks + '"  where id="' + req.params.id + '"', (err, row, fields) => {


        if (!err) {
            res.send(row)
        }
        else {
            res.send(err)
        }


    })
}

const deleteEnquiry = (req,res) =>{
    console.log(req.params.id)
    connection.query('delete  from  `enquires` where id="' + req.params.id + '"', (err, row, fields) => {

        if (!err) {
            res.send(row)
        }
        else {
            res.send(err)
        }
y

    })

}

const viewEnquiry = (req, res) => {
  const query = `
    SELECT enquires.*, enquriy_products.product, enquriy_products.quantity, enquriy_products.unitprice, enquriy_products.totalprice
    FROM enquires
    JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber;
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error fetching data');
    } else {
      console.log(results); // Log the fetched data

      // Group products by enquiry reference number
      const groupedResults = results.reduce((acc, curr) => {
        console.log(curr)
        const { enquiryreferncenumber, product, quantity, unitprice, totalprice, ...rest } = curr;
        if (!acc[enquiryreferncenumber]) {
          acc[enquiryreferncenumber] = { ...rest, products: [] };
        }
        acc[enquiryreferncenumber].products.push({ product, quantity, unitprice, totalprice });
        return acc;
      }, {});   
      
      // Convert object back to array
      const transformedResults = Object.values(groupedResults);
      console.log(transformedResults); // Log the transformed data
      res.json(transformedResults);
    }
  });
};

  
 
  
  module.exports = { viewEnquiry, updateEnquiry };
  
  

// const viewEnquiry = (req,res) =>{
//     connection.query('select * from  enquires', (err, rows, fields) => {

//         if (!err) {
//             res.send(rows)
//         }
//         else {
//             res.send(err)
//         }


//     })
// }

const singleEnquiry = (req, res) => {
    // console.log(req.params.id)
    const query = `
      SELECT enquires.*, enquriy_products.product, enquriy_products.quantity, enquriy_products.unitprice, enquriy_products.totalprice
      FROM enquires
      JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
      WHERE enquires.user_id = ${req.params.id};
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