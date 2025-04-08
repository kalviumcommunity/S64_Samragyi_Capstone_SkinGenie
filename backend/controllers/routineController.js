const Routine = require('../models/routine');  // Import the routine model
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
    if (!skinType || !steps) {
      return res.status(400).json({ error: "skinType and steps are required" });
    }
    const newRoutine = await Routine.create({ skinType, steps });
    res.status(201).json(newRoutine);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};