const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const { Dbconnection } = require("./database/db");
const authRoutes = require("./routes/authroutes");
const problemRoutes = require('./routes/problems');
const addProblemAdminRoute = require('./routes/addProblemAdminRoute');
const testcaseRoutes = require("./routes/testcaseRoutes");
const submitRoute = require("./routes/submit");
const submissionRoutes = require("./routes/submissionRoutes");
const aiReviewRoute = require("./routes/aiReview");
const deletep = require("./routes/deletep");
const hiddenTestcaseRoutes = require("./routes/hiddenTestcaseRoutes");



dotenv.config();
Dbconnection();

app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use('/api/admin/problems', addProblemAdminRoute);
app.use("/api/run", require("./routes/run"));
app.use("/api/testcases", testcaseRoutes);
app.use("/api/submit", submitRoute);
app.use("/api/hidden-testcases", hiddenTestcaseRoutes); 
app.use("/api/submissions", submissionRoutes);
app.use("/api/getprofile",require("./routes/getProfile"));
app.use("/api/ai-review", aiReviewRoute);
app.use("/api/delete",deletep);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
