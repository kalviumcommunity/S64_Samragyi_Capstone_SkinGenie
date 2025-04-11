const User = require('../models/user');
const Routine = require('../models/routine');
exports.submitQuiz = async (req, res) => {
  try {
    const { skinType } = req.body;
    const userId = req.body.userId; 
    const matchingRoutines = await Routine.find({ skinType });
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        skinType, 
        recommendedRoutines: matchingRoutines.map(routine => routine._id)
      },
      { new: true }
    ).populate('recommendedRoutines');
    res.status(200).json({
      skinType,
      recommendedRoutines: updatedUser.recommendedRoutines
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getUserRoutines = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .populate('recommendedRoutines');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      skinType: user.skinType,
      recommendedRoutines: user.recommendedRoutines
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};