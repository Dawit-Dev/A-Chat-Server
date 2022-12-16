const PORT = process.env.port || 4000;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
  timeSent: new Date().toLocaleDateString(),
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
//read all messages
app.get("/messages", function (request, response) {
  response.send(messages);
});
//read the last ten messages
app.get("/messages/latest/", (req, res) => {
  let latestMessages = messages.filter(
    (mes, index) => messages.length - 10 <= index
  );
  res.send(latestMessages);
});

//read one message
app.get("/messages/:id", function (request, response) {
  const findMessage = messages.find(
    (message) => message.id === Number(request.params.id)
  );
  if (findMessage) return response.send(findMessage);
  response.status(400).send("Message not found");
});
//post messages
let incrementId = 1;
app.post("/messages", function (request, response) {
  console.log(request);
  if (request.body.from.length === 0 || request.body.text.length === 0)
    response.status(400).send("Message is empty!");
  messages.push({
    id: incrementId,
    timeSent: new Date().toLocaleDateString(),
    ...request.body,
  });
  response.status(200).send("Message added");
  incrementId += 1;
});
//Delete a message
app.delete("/messages/:id", function (request, response) {
  messages = request.params.id
    ? messages.filter((message) => message.id !== Number(request.params.id))
    : messages;
  response.status(200).send("Message successfully deleted");
});
//Search for messages
app.get("/messages/search/:text", (req, res) => {
  let filteredMessages = messages.filter((message) =>
    message.text.includes(req.query.text)
  );
  res.send(filteredMessages);
});

app.listen(PORT, function () {
  console.log("Your app is listening on port " + PORT);
});
