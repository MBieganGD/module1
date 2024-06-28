import express from "express";
import bodyParser from "body-parser";
import logger from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import { Request, Response } from "express";
import getSecret from "./secret";
import Data from "./data";

const API_PORT = 3001;
const app = express();
const router = express.Router();

app.use(cors());

mongoose
  .connect(getSecret("dbUri"), {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

router.get("/getData", async (req: Request, res: Response) => {
  try {
    const data = await Data.find();
    res.json({ success: true, data: data });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

router.post("/updateData", async (req: Request, res: Response) => {
  const { id, update } = req.body;
  try {
    await Data.findByIdAndUpdate(id, update);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

router.delete("/deleteData", async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    await Data.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

router.post("/putData", async (req: Request, res: Response) => {
  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "Invalid Inputs",
    });
  }

  const data = new Data({ id, message });

  try {
    await data.save();
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, error: err });
  }
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`Server running on port: ${API_PORT}`));
