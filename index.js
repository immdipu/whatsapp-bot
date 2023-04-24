const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config();

let port = process.env.PORT || 3000;
let mytoken = process.env.TOKEN;

const app = express();
app.use(express.json());

app.listen(port, () => {
  console.log("Server started sucessfully");
});

app.get("/webhooks", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  if (mode === "subscribe" && token === mytoken) {
    res.status(200).send(challenge);
  } else {
    res.status(403);
  }
});

app.post("/webhooks", (req, res) => {
  console.log(req.body);
});
