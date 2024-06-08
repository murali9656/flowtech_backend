const connection = require('../connection/connection');

const reportsView = (req, res) => {   
    const query = `
  SELECT enquires.*, 
    (SELECT COUNT(*) FROM updates WHERE updates.enquiryreferncenumber = enquires.enquiryreferncenumber) AS row_count,
    (SELECT MAX(date) FROM updates WHERE updates.enquiryreferncenumber = enquires.enquiryreferncenumber) AS last_update_date
FROM enquires
JOIN enquriy_products ON enquires.enquiryreferncenumber = enquriy_products.enquiryreferncenumber
LEFT JOIN updates ON enquires.enquiryreferncenumber = updates.enquiryreferncenumber
WHERE enquires.enquiry_status != 'completed'
GROUP BY enquires.enquiryreferncenumber;


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


  module.exports = {reportsView};
  