const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const axios = require("axios");

dotenv.config();

let port = process.env.PORT || 3000;
let mytoken = process.env.TOKEN;
const access_token = process.env.ACCESS_TOKEN;

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
  const data = req.body;
  let phoneNumber = data.entry[0].changes[0].value.messages[0].from;
  let phoneNumberId = data.entry[0].changes[0].value.metadata.phone_number_id;
  let name = data.entry[0].changes[0].value.contacts[0].profile.name;
  let text = data.entry[0].changes[0].value.messages[0].text.body;

  let newdata = JSON.stringify({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phoneNumber,
    type: "text",
    text: {
      body: "Hello how are you ",
    },
  });

  axios.post(
    `https://graph.facebook.com/v16.0/${phoneNumberId}/messages`,
    newdata,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  res.status(200);
});
