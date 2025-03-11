const Design = require("../models/Design")

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

  
 
  const solarRadiation = {
    Bangalore: { north: 150, south: 250, east: 200, west: 200, roof: 300 },
    Mumbai: { north: 180, south: 350, east: 280, west: 270, roof: 400 },
    Kolkata: { north: 200, south: 400, east: 300, west: 290, roof: 450 },
    Delhi: { north: 160, south: 270, east: 220, west: 220, roof: 320 },
  };
  
  const electricityRates = {
    Bangalore: 6.5,
    Mumbai: 9.0,
    Kolkata: 7.5,
    Delhi: 8.5,
  };
  
  const DEFAULT_COP = 4;
  const DELTA_T = 6; // Assumed 6 hours exposure
  
  exports.getCityRankings = async (req, res) => {
    try {
      const { A, SHGC } = req.query;
  
      if (!A || !SHGC) {
        return res.status(400).json({ error: "Missing A (window area) or SHGC" });
      }
  
      const windowArea = parseFloat(A);
      const SHGCValue = parseFloat(SHGC);
  
      if (isNaN(windowArea) || isNaN(SHGCValue) || windowArea <= 0 || SHGCValue < 0 || SHGCValue > 1) {
        return res.status(400).json({ error: "Invalid values for A or SHGC" });
      }
  
      let rankings = [];
  
      Object.keys(solarRadiation).forEach((city) => {
        const cityData = solarRadiation[city];
  
        // Calculate average solar radiation
        const avgG =
          (cityData.north + cityData.south + cityData.east + cityData.west + cityData.roof) / 5;
  
        // Step 1: Calculate Heat Gain (Q)
        const Q = windowArea * SHGCValue * avgG * DELTA_T;
  
        // Step 2: Convert to Cooling Load (kWh)
        const coolingLoad = Q / 3412;
  
        // Step 3: Calculate Energy Consumed
        const energyConsumed = coolingLoad / DEFAULT_COP;
  
        // Step 4: Calculate Cooling Cost
        const coolingCost = energyConsumed * electricityRates[city];
  
        rankings.push({ city, coolingCost });
      });
  
      // Step 5: Sort Cities by Cooling Cost (Ascending Order)
      rankings.sort((a, b) => a.coolingCost - b.coolingCost);
  
      res.json(rankings);
    } catch (error) {
      console.error("Error in getCityRankings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
