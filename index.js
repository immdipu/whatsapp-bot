const express = require("express");
const dotenv = require("dotenv");

const axios = require("axios");

dotenv.config();

let port = process.env.PORT || 3000;
let mytoken = process.env.TOKEN;
const access_token = process.env.ACCESS_TOKEN;
const applicatoin_id = process.env.APPLICATION_ID;

const app = express();
app.use(express.json());

const getRes = async (text) => {
  const res = await axios.post("https://www.botlibre.com/rest/json/chat", {
    application: applicatoin_id,
    instance: "165",
    message: text,
  });
  const result = res.data.message;
  return result;
};

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

  if (
    data &&
    data?.entry[0] &&
    data.entry[0]?.changes[0] &&
    data.entry[0].changes[0]?.value?.messages
  ) {
    let phoneNumber = data.entry[0].changes[0].value.messages[0].from;
    let phoneNumberId = data.entry[0].changes[0].value.metadata.phone_number_id;
    let text = data.entry[0].changes[0].value.messages[0].text.body;

    getRes(text)
      .then((resp) => {
        let newdata = JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phoneNumber,
          type: "text",
          text: {
            body: resp,
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
      })
      .catch((err) => {
        console.log(err);
        res.status(404);
      });
  } else {
    res.status(404);
  }
});

app.listen(port, () => {
  console.log("Server started sucessfully");
});
