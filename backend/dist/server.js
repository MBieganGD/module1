"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const secret_1 = __importDefault(require("./secret"));
const data_1 = __importDefault(require("./data"));
const API_PORT = 3001;
const app = (0, express_1.default)();
const router = express_1.default.Router();
app.use((0, cors_1.default)());
mongoose_1.default
    .connect((0, secret_1.default)("dbUri"), {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)("dev"));
router.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});
router.get("/getData", async (req, res) => {
    try {
        const data = await data_1.default.find();
        res.json({ success: true, data: data });
    }
    catch (err) {
        res.json({ success: false, error: err });
    }
});
router.post("/updateData", async (req, res) => {
    const { id, update } = req.body;
    try {
        await data_1.default.findByIdAndUpdate(id, update);
        res.json({ success: true });
    }
    catch (err) {
        res.json({ success: false, error: err });
    }
});
router.delete("/deleteData", async (req, res) => {
    const { id } = req.body;
    try {
        await data_1.default.findByIdAndDelete(id);
        res.json({ success: true });
    }
    catch (err) {
        res.json({ success: false, error: err });
    }
});
router.post("/putData", async (req, res) => {
    const { id, message } = req.body;
    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: "Invalid Inputs",
        });
    }
    const data = new data_1.default({ id, message });
    try {
        await data.save();
        res.json({ success: true });
    }
    catch (err) {
        res.json({ success: false, error: err });
    }
});
app.use("/api", router);
app.listen(API_PORT, () => console.log(`Server running on port: ${API_PORT}`));
