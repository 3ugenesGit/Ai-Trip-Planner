const Trip = require('../models/Trip');

exports.createTrip = async (req, res) => {
    const { title, destination, days, budget, itinerary } = req.body;

    try {
        const newTrip = new Trip({
            title,
            destination,
            days,
            budget,
            itinerary,
            userId: req.user.id
        });

        const trip = await newTrip.save();
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        res.json(trip);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: "Trip not found" });
        }
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateTrip = async (req, res) => {
    const { title, destination, days, budget, itinerary } = req.body;

    try {
        let trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        trip = await Trip.findByIdAndUpdate(
            req.params.id,
            { $set: { title, destination, days, budget, itinerary } },
            { new: true }
        );

        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        if (trip.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: "User not authorized" });
        }

        await Trip.findByIdAndDelete(req.params.id);

        res.json({ message: "Trip removed" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};
