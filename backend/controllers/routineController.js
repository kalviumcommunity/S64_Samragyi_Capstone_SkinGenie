const mongoose = require('mongoose');
const Routine = require('../models/routine');
const Product = require('../models/Product'); // Import Product model

// Function to get routines by skin type
exports.getRoutinesBySkinType = async (req, res) => {
    try {
        const skinType = req.params.skinType;

        if (!skinType) {
            return res.status(400).json({ error: 'Skin type parameter is required' });
        }

        // Find routines matching the skinType and populate product details
        const routines = await Routine.find({ skinType }).populate('steps').exec();

        if (!routines || routines.length === 0) {
            return res.status(404).json({ message: 'No routines found for this skin type' });
        }

        // Separate products into AM and PM based on timeOfDay
        const amRoutine = [];
        const pmRoutine = [];

        routines.forEach(routine => {
            routine.steps.forEach(product => {
                // Check product timeOfDay field and add to respective arrays
                if (product.timeOfDay === 'AM' || product.timeOfDay === 'Both') {
                    amRoutine.push(product);
                }
                if (product.timeOfDay === 'PM' || product.timeOfDay === 'Both') {
                    pmRoutine.push(product);
                }
            });
        });

        // Send the categorized data in the response
        res.status(200).json({
            skinType,
            amRoutine,
            pmRoutine,
        });
    } catch (error) {
        console.error('Error fetching routines:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Function to create a new routine
exports.createRoutine = async (req, res) => {
    try {
        const { skinType, steps } = req.body;

        if (!skinType?.trim() || !steps) {
            return res.status(400).json({ error: "skinType and steps are required" });
        }

        if (!Array.isArray(steps)) {
            return res.status(400).json({ error: "steps must be an array" });
        }

        // Check if steps are valid ObjectIds
        if (steps.some(step => !mongoose.Types.ObjectId.isValid(step))) {
            return res.status(400).json({ error: "Invalid Product ID in steps" });
        }

        const newRoutine = await Routine.create({
            skinType: skinType.trim(),
            steps: steps // steps are now ObjectIds
        });

        res.status(201).json(newRoutine);
    } catch (err) {
        console.error("Error creating routine:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Function to update an existing routine by ID
exports.updateRoutine = async (req, res) => {
    try {
        const { id } = req.params;
        const { skinType, steps } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid routine ID" });
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
        console.error("Error updating routine:", err);
        res.status(500).json({ error: "Server error" });
    }
};