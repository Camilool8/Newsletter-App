const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
const port = 17457;

mailchimp.setConfig({
  apiKey: "65ad4836635470d06c8f9b8a06acccb7-us21",
  server: "us21",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/signup.html"));

app.post("/", function (req, res) {
  const listId = "47ec39aaea";
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
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
