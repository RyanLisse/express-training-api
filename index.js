const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello from Nerdbord!");
});

app.post("/trains", (req, res) => {
  const createTrainPayload = req.body;

  // Input validation
  if (!createTrainPayload.trainExpressName ||
      !createTrainPayload.countryOfOrigin ||
      !createTrainPayload.yearOfConstruction ||
      !createTrainPayload.maxKilometerPerHour ||
      !createTrainPayload.destinationFrom ||
      !createTrainPayload.destinationTo) {
    res.status(400).send("Missing required fields");
    return;
  }

  if (isNaN(parseInt(createTrainPayload.yearOfConstruction)) ||
      isNaN(parseInt(createTrainPayload.maxKilometerPerHour))) {
    res.status(400).send("Invalid data types");
    return;
  }

  const trainFilePath = path.join(__dirname, "data", "trains.json");
  let trains;
  try {
    trains = JSON.parse(fs.readFileSync(trainFilePath));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading trains file");
    return;
  }

  trains.push(createTrainPayload);

  try {
    fs.writeFileSync(trainFilePath, JSON.stringify(trains));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error writing to trains file");
    return;
  }

  res.send("Train added successfully");
});

app.get("/trains", (req, res) => {
  const trainFilePath = path.join(__dirname, "data", "trains.json");
  let trains;
  try {
    trains = JSON.parse(fs.readFileSync(trainFilePath));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading trains file");
    return;
  }

  res.send(trains);
});

app.put("/trains/:id", (req, res) => {
  const updatedTrainPayload = req.body;
  const trainId = req.params.id;

  // Input validation
  if (!updatedTrainPayload.trainExpressName ||
      !updatedTrainPayload.countryOfOrigin ||
      !updatedTrainPayload.yearOfConstruction ||
      !updatedTrainPayload.maxKilometerPerHour ||
      !updatedTrainPayload.destinationFrom ||
      !updatedTrainPayload.destinationTo) {
    res.status(400).send("Missing required fields");
    return;
  }

  if (isNaN(parseInt(updatedTrainPayload.yearOfConstruction)) ||
      isNaN(parseInt(updatedTrainPayload.maxKilometerPerHour))) {
    res.status(400).send("Invalid data types");
    return;
  }

  const trainFilePath = path.join(__dirname, "data", "trains.json");
  let trains;
  try {
    trains = JSON.parse(fs.readFileSync(trainFilePath));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading trains file");
    return;
  }

  const existingTrainIndex = trains.findIndex(train => train.id === trainId);
  if (existingTrainIndex === -1) {
    res.status(404).send("Train not found");
    return;
  }

  const updatedTrain = { ...trains[existingTrainIndex], ...updatedTrainPayload };
  trains[existingTrainIndex] = updatedTrain;

  try {
    fs.writeFileSync(trainFilePath, JSON.stringify(trains));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error writing to trains file");
    return;
  }

  res.send("Train updated successfully"); });

app.listen(PORT, () => { console.log(Server listening on port ${PORT}); });
