const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dimensions: { height: Number, width: Number }, 
  WWR: { type: Number, required: true },
  SHGC: { type: Number, required: true },
  city: { type: String, required: true },
});

const Design = mongoose.model("Design", DesignSchema);
module.exports = Design;
