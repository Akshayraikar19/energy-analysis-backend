const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const configureDB = require("./config/db");
const { createDesign, getDesigns, getDesignById, updateDesign, deleteDesign } = require("./app/controllers/designControllers");
const { calculateHeatGain, compareDesigns, getCityRankings } = require("./app/controllers/analysisController");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

configureDB();

// Routes for Building Designs
app.post("/api/designs", createDesign);
app.get("/api/designs", getDesigns);
app.get("/api/designs/:id", getDesignById);
app.put("/api/designs/:id", updateDesign);
app.delete("/api/designs/:id", deleteDesign);

// Routes for Analysis
app.post("/api/analysis/calculate", calculateHeatGain);
app.get("/api/analysis/compare", compareDesigns);
app.get("/api/analysis/cities", getCityRankings);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
