const Design = require("../models/Design")


exports.calculateHeatGain = async (req, res) => {
    const { dimensions, WWR, SHGC, city } = req.body;
    const solarRadiation = { Bangalore: 200, Mumbai: 280, Kolkata: 300, Delhi: 220 };
  
    if (!solarRadiation[city]) {
      return res.status(400).json({ error: "Invalid city name" });
    }
  
    const A = dimensions.height * dimensions.width * WWR;
    const G = solarRadiation[city];
    const heatGain = A * SHGC * G * 1;
  
    res.json({ heatGain });
  };
  
  
exports.compareDesigns = async (_req, res) => {
    try {
      const designs = await Design.find();
      return res.json(designs);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to retrieve designs' });
    }
  };
  
  exports.getCityRankings = async (req, res) => {
    const rankings = [
      { city: "Bangalore", score: 85 },
      { city: "Mumbai", score: 78 },
      { city: "Kolkata", score: 90 },
      { city: "Delhi", score: 82 },
    ];
    res.json(rankings);
  };
  