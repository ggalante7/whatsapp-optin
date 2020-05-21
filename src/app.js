const express = require("express")
const app = express()
const controller = require("./controller/optinController");
const bodyParser = require("body-parser");

function requestTime (req, res, next) {
  req.requestTime = Date.now();
  next();
}
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(requestTime);

app.get('/', (req, res) => res.send('Hello World!'));

app.get("/optins/:tenant/:contact", function(req, res) {
    controller.getOptins(req, res);
});

app.get("/optin/client/:tenant/:contact/:client_id", function(req, res){
    controller.getOptinByClient(req, res);
});

app.get("/optin/mean_contact/:tenant/:contact/:mean_contact", function(req, res) {
    controller.getOptinByMeanContact(req,res);
});

app.post("/optin", function(req, res) {
    controller.optin(req, res);
})

app.delete("/optout/:tenant/:contact/:client_id/:mean_contact", function(req, res) {
    controller.optout(req, res);
})

app.listen(3002);