const Design = require("../models/Design");

exports.createDesign = async (req, res) => {
  try {
    const newDesign = await Design.create(req.body);
    res.status(201).json(newDesign);
  } catch (error) {
    res.status(500).json({ error: "Failed to create design" });
  }
};

exports.getDesigns = async (req, res) => {
  const designs = await Design.find();
  res.json(designs);
};

exports.getDesignById = async (req, res) => {
  const design = await Design.findById(req.params.id);
  res.json(design);
};

exports.updateDesign = async (req, res) => {
  const updatedDesign = await Design.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedDesign);
};

exports.deleteDesign = async (req, res) => {
  await Design.findByIdAndDelete(req.params.id);
  res.json({ message: "Design deleted" });
};
