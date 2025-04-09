const mongoose = require('mongoose');
const Routine = require('../models/routine'); 
exports.getRoutinesBySkinType = async (req, res) => {
  try {
    const routines = await Routine.find({ skinType: req.params.skinType });
    if (!routines.length) {
      return res.status(404).json({ message: 'No routines found' });
    }
    res.status(200).json(routines);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createRoutine = async (req, res) => {
  try {
    const { skinType, steps } = req.body;
    if (!skinType?.trim() || !steps) 
      return res.status(400).json({ error: "skinType and steps are required" });
    if (!Array.isArray(steps))
      return res.status(400).json({ error: "steps must be an array" });
    if (steps.some(step => !step?.trim()))
      return res.status(400).json({ error: "steps cannot be empty" });

    const newRoutine = await Routine.create({ 
      skinType: skinType.trim(),  // Trimmed input
      steps: steps.map(step => step.trim()) 
    });
    res.status(201).json(newRoutine);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const { skinType, steps } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid routine ID" }); // JSON response
    }
    if (!skinType?.trim() || !Array.isArray(steps)) {
      return res.status(400).json({ error: "skinType and steps are required" });
    }
    const updatedRoutine = await Routine.findByIdAndUpdate(
      id,
      { 
        skinType: skinType.trim(), 
        steps: steps.map(step => step.trim()) 
      },
      { 
        new: true,      
        runValidators: true
      }
    );
    if (!updatedRoutine) {
      return res.status(404).json({ error: "Routine not found" }); 
    }
    res.json(updatedRoutine); 
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};