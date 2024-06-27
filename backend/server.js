const mongoose = require("mongoose");
const getSecret = require("./secret");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

const cors = require("cors");
app.use(cors());

mongoose.connect(getSecret("dbUri"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

router.get("/getData", async (req, res) => {
  try {
    const data = await Data.find();
    res.json({ success: true, data: data });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

router.post("/updateData", async (req, res) => {
  const { id, update } = req.body;
  try {
    await Data.findByIdAndUpdate(id, update);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

router.delete("/deleteData", async (req, res) => {
  const { id } = req.body;
  try {
    await Data.findByIdAndRemove(id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

router.post("/putData", async (req, res) => {
  let data = new Data();
  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "Invalid Inputs",
    });
  }
  data.message = message;
  data.id = id;
  try {
    await data.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`port: ${API_PORT}`));
