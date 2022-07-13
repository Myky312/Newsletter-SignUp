const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
//if we do only this way we cannot send other files like css and images
//thats why we need exress static public parameter
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(request, res) {
  var firstName = request.body.fName;
  var secondName = request.body.lName;
  var email = request.body.email;
  console.log(firstName, secondName, email);
  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: secondName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/097878e119";

  const options = {
    method: "POST",
    auth: "Myktybek:2890eb839d96d45b9e8395482f1cd67d-us14"
  }

  const thisrequest = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  thisrequest.write(jsonData);
  thisrequest.end();
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})


// Api Key
// 2890eb839d96d45b9e8395482f1cd67d-us14

// List Id
// 097878e119
