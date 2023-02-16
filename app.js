const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

const PORT = process.env.PORT;
const API_KEY = process.env.API_KEY;
const SERVER = process.env.SERVER;
const LIST_ID = process.env.LIST_ID;

mailchimp.setConfig({
  apiKey: API_KEY,
  server: SERVER,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/signup.html"));

app.post("/", function (req, res) {
  const listId = LIST_ID;
  const subscribingUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );

      res.sendFile(__dirname + "/success.html");
    } catch (e) {
      console.log(e);
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
