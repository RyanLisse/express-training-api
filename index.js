const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const trainFilePath = path.join(__dirname, "data", "trains.json");




  let trains;
  try {
    trains = JSON.parse(fs.readFileSync(trainFilePath));
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error reading trains file: ${err.message}`);
    return;
  }

  const existingTrainIndex = trains.findIndex((train) => train.id === trainId);
  if (existingTrainIndex === -1) {
    res.status(404).send("Train not found");
    return;
  }

  trains.splice(existingTrainIndex, 1);

  try {
    fs.writeFileSync(trainFilePath, JSON.stringify(trains));
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error writing to trains file: ${err.message}`);
    return;
  }

  res.send("Train deleted successfully");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.listen(PORT, () => { console.log(Server listening on port ${PORT}); });


