const parse = require("csv-parse/lib/sync");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cowake = require("./cowake");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/", function(req, res) {
  let tsv = req.body.tsv;
  let sessionTime = req.body.session_time;
  let talkTime = req.body.talk_time;
  let minIntroTime = req.body.min_intro_time;
  let minMembers = req.body.min_members;
  let members;
  try {
    members = cowake.parseTsv(tsv);
  } catch (err) {
    res.json({
      success: false,
      message: err.message,
    });
    return;
  }
  let groups = cowake.makeGroups(members, sessionTime, talkTime, minIntroTime, minMembers);
  res.json(
    groups[0].allSessions()
  );
});

app.listen(3000);
