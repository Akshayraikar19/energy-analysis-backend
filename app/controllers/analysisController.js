const Design = require("../models/Design")


// exports.calculateHeatGain = async (req, res) => {
//     const { dimensions, WWR, SHGC, city } = req.body;
//     const solarRadiation = { Bangalore: 200, Mumbai: 280, Kolkata: 300, Delhi: 220 };
  
//     if (!solarRadiation[city]) {
//       return res.status(400).json({ error: "Invalid city name" });
//     }
  
//     const A = dimensions.height * dimensions.width * WWR;
//     const G = solarRadiation[city];
//     const heatGain = A * SHGC * G * 1;
  
//     res.json({ heatGain });
  //};

  exports.calculateHeatGain = async (req, res) => {
    const { dimensions, WWR, SHGC, city, costPerKWh = 8 } = req.body; // Default cost: ₹8/kWh
    
    const solarRadiation = { Bangalore: 200, Mumbai: 280, Kolkata: 300, Delhi: 220 };

    if (!solarRadiation[city]) {
        return res.status(400).json({ error: "Invalid city name" });
    }

    const A = dimensions.height * dimensions.width * WWR; // Window area (sq. ft)
    const G = solarRadiation[city]; // Solar radiation (BTU/sq.ft-hr)
    const exposureTime = 1; // Hours (default)

    // Step 1: Heat Gain Calculation (BTU)
    const heatGain = A * SHGC * G * exposureTime;

    // Step 2: Convert BTU to kWh
    const coolingLoad = heatGain / 3412;

    // Step 3: Energy Consumption (kWh) using COP = 4
    const COP = 4;
    const energyConsumed = coolingLoad / COP;

    // Step 4: Cooling Cost Estimation (₹)
    const coolingCost = energyConsumed * costPerKWh;

    res.json({ 
        heatGain: heatGain.toFixed(2), 
        coolingLoad: coolingLoad.toFixed(2), 
        energyConsumed: energyConsumed.toFixed(2),
        coolingCost: coolingCost.toFixed(2) // ₹ Cost
    });
};

exports.compareDesigns = async (req, res) => {
  try {
      const costPerKWh = req.body.costPerKWh || 8;  // Default ₹8/kWh
      const designs = await Design.find();  

      const updatedDesigns = designs.map(design => {
          const { dimensions, WWR, SHGC, city } = design;
          const solarRadiation = { Bangalore: 200, Mumbai: 280, Kolkata: 300, Delhi: 220 };

          if (!solarRadiation[city]) return design;

          const A = dimensions.height * dimensions.width * WWR;
          const G = solarRadiation[city];
          const heatGain = A * SHGC * G * 1;  

          const coolingLoad = heatGain / 3412;  
          const energyConsumed = coolingLoad / 4;  
          const coolingCost = energyConsumed * costPerKWh;  

          return {
              ...design.toObject(),
              heatGain: Number(heatGain).toFixed(2),   // Ensure it's a number
              coolingLoad: Number(coolingLoad).toFixed(2),
              energyConsumed: Number(energyConsumed).toFixed(2),
              coolingCost: Number(coolingCost).toFixed(2)
          };
      });

      res.json(updatedDesigns);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching design comparisons' });
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
  