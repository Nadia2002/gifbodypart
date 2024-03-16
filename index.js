const express = require('express');
const csvParser = require('csv-parser');
const fs = require('fs');



const app = express();
  const PORT = process.env.PORT || 3000;
app.get('/api/csv', (req, res) => {
  // Array to hold the CSV data
  const results = [];
  // Extract the value of the 'bodyPart' query parameter, if provided
  const { bodyPart } = req.query;
  console.log('Query Parameter (bodyPart):', bodyPart);

  // Read the CSV file, parse it, and process the data
  fs.createReadStream('data.csv')
      .pipe(csvParser())
      .on('data', (data) => {
          console.log('Data from CSV:', data);
          
          // Custom logic to extract 'bodyPart' from the row data
          const exerciseBodyPart = extractBodyPartFromRow(data);
          
          // If 'bodyPart' query parameter is provided and it matches the exercise's body part, add the data to results
          if (bodyPart && exerciseBodyPart && exerciseBodyPart.trim().toLowerCase() !== bodyPart.trim().toLowerCase()) {
              return;
          }

          // Otherwise, add the data to the results array
          results.push(data);
      })
      .on('end', () => {
          // Send the results array as a JSON response
          res.json(results);
      });
});

// Custom function to extract 'bodyPart' from the row data
function extractBodyPartFromRow(data) {
  // Assuming 'bodyPart' is the first value in the row
  // You may need to adjust this depending on the structure of your CSV
  return data[Object.keys(data)[0]]; // Assuming 'bodyPart' is the first column
}
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});