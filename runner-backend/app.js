const express = require("express");
const runRoute = require("./routes/run");
const cors = require("cors");
const { startCleanupSchedule } = require('./utils/cleanupScheduler');
const dotenv = require("dotenv");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/run", runRoute);
startCleanupSchedule();

const PORT = process.env.PORT;
app.listen(PORT, () => (console.log(`Runner backend running on port`)));