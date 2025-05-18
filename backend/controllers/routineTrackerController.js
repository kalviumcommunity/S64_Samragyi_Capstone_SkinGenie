const RoutineTracker = require('../models/routineTracker');

// Get tracking data for a specific date range
exports.getRoutineTracking = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const query = { userId };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const trackingData = await RoutineTracker.find(query)
      .sort({ date: -1 })
      .populate('completedItems.productId');
      
    res.status(200).json(trackingData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Track completed routine items
exports.trackRoutineItem = async (req, res) => {
  try {
    const { userId, date, productId, timeOfDay, completed } = req.body;
    
    // Format date to remove time component (store only the day)
    const trackingDate = new Date(date);
    trackingDate.setHours(0, 0, 0, 0);
    
    // Find or create tracking entry for this date
    let trackingEntry = await RoutineTracker.findOne({ 
      userId, 
      date: trackingDate 
    });
    
    if (!trackingEntry) {
      trackingEntry = new RoutineTracker({
        userId,
        date: trackingDate,
        completedItems: []
      });
    }
    
    // Add or remove the product from completed items
    if (completed) {
      // Check if item is already tracked
      const existingItem = trackingEntry.completedItems.find(
        item => item.productId.toString() === productId && item.timeOfDay === timeOfDay
      );
      
      if (!existingItem) {
        trackingEntry.completedItems.push({ productId, timeOfDay });
      }
    } else {
      // Remove item if it exists
      trackingEntry.completedItems = trackingEntry.completedItems.filter(
        item => !(item.productId.toString() === productId && item.timeOfDay === timeOfDay)
      );
    }
    
    await trackingEntry.save();
    res.status(200).json(trackingEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add notes to a tracking entry
exports.addTrackingNotes = async (req, res) => {
  try {
    const { userId, date, notes } = req.body;
    
    // Format date to remove time component
    const trackingDate = new Date(date);
    trackingDate.setHours(0, 0, 0, 0);
    
    const updatedEntry = await RoutineTracker.findOneAndUpdate(
      { userId, date: trackingDate },
      { notes },
      { new: true, upsert: true }
    );
    
    res.status(200).json(updatedEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};