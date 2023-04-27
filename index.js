const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;
const trainFilePath = path.join(__dirname, "data", "trains.json");

app.get("/", (req, res) => {
  res.send("Hello from Nerdbord!");
});

app.post("/trains", (req, res) => {
  const createTrainPayload = req.body;

  const requiredFields = [
    { field: "trainExpressName", label: "Train Express Name" },
    { field: "countryOfOrigin", label: "Country of Origin" },
    { field: "yearOfConstruction", label: "Year of Construction" },
    { field: "maxKilometerPerHour", label: "Max Kilometer per Hour" },
    { field: "destinationFrom", label: "Destination From" },
    { field: "destinationTo", label: "Destination To" },
  ];

  const missingFields = requiredFields.filter(
    (field) => !createTrainPayload[field.field]
  );

  if (missingFields.length > 0) {
    const missingFieldNames = missingFields
      .map((field) => field.label)
      .join(", ");
    res.status(400).send(`Missing required fields: ${missingFieldNames}`);
    return;
  }

  const numericFields = ["yearOfConstruction", "maxKilometerPerHour"];
  const invalidFields = numericFields.filter((field) =>
    isNaN(parseInt(createTrainPayload[field]))
  );

  if (invalidFields.length > 0) {
    const invalidFieldNames = invalidFields
      .map((field) => field.label)
      .join(", ");
    res.status(400).send(`Invalid data types for fields: ${invalidFieldNames}`);
    return;
  }

  let trains;
  try {
    trains = JSON.parse(fs.readFileSync(trainFilePath));
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error reading trains file: ${err.message}`);
    return;
  }

  trains.push(createTrainPayload);

  try {
    fs.writeFileSync(trainFilePath, JSON.stringify(trains));
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error writing to trains file: ${err.message}`);
    return;
  }

  res.send("Train added successfully");
});

app.get("/trains", (req, res) => {
  let trains;
  try {
    trains = JSON.parse(fs.readFileSync(trainFilePath));
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error reading trains file: ${err.message}`);
    return;
  }

  res.send(trains);
});

app.put("/trains/:id", (req, res) => {
  const updatedTrainPayload = req.body;
  const trainId = req.params.id;

  const requiredFields = [
    { field: "trainExpressName", label: "Train Express Name" },
    { field: "countryOfOrigin", label: "Country of Origin" },
    { field: "yearOfConstruction", label: "Year of Construction" },
    { field: "maxKilometerPerHour", label: "Max Kilometer per Hour" },
    { field: "destinationFrom", label: "Destination From" },
    { field: "destinationTo", label: "Destination To" },
  ];

  const missingFields = requiredFields.filter(
    (field) => !updatedTrainPayload[field.field]
  );

  if (missingFields.length > 0) {
    const missingFieldNames = missingFields
      .map((field) => field.label)
      .join(", ");
    res.status(400).send(`Missing required fields: ${missingFieldNames}`);
    return;
  }

  const numericFields = ["yearOfConstruction", "maxKilometerPerHour"];
  const invalidFields = numericFields.filter((field) =>
    isNaN(parseInt(updatedTrainPayload[field]))
  );

  if (invalidFields.length > 0) {
    const invalidFieldNames = invalidFields
      .map((field) => field.label)
      .join(", ");
    res.status(400).send(`Invalid data types for fields: ${invalidFieldNames}`);
    return;
  }

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

  const updatedTrain = {
    ...trains[existingTrainIndex],
    ...updatedTrainPayload,
  };
  trains[existingTrainIndex] = updatedTrain;

  try {
    fs.writeFileSync(trainFilePath, JSON.stringify(trains));
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error writing to trains file: ${err.message}`);
    return;
  }

  res.send("Train updated successfully");
});

app.delete("/trains/:id", (req, res) => {
  const trainId = req.params.id;

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
