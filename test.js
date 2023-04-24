let data = {
  object: "whatsapp_business_account",
  entry: [
    {
      id: "WHATSAPP_BUSINESS_ACCOUNT_ID",
      changes: [
        {
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: "PHONE_NUMBER",
              phone_number_id: "PHONE_NUMBER_ID",
            },
            contacts: [
              {
                profile: {
                  name: "NAME",
                },
                wa_id: "PHONE_NUMBER",
              },
            ],
            messages: [
              {
                from: "PHONE_NUMBER",
                id: "wamid.ID",
                timestamp: "TIMESTAMP",
                text: {
                  body: "MESSAGE_BODY",
                },
                type: "text",
              },
            ],
          },
          field: "messages",
        },
      ],
    },
  ],
};

const newdata = data.entry[0];
let phoneNumber = data.entry[0].changes[0].value.metadata.display_phone_number;
let name = data.entry[0].changes[0].value.contacts[0].profile.name;
console.log(name);
