const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    try {
        const trips = await Model.find({}).exec();
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const tripsFindByCode = async(req, res) => {
    const q = await Model
        .find({'code' : req.params.tripCode }) // Return single record
        .exec();

            console.log(q);

    if (!q) {
        // Database returned no data
        return res
                .status(404)
                .json(err);

    } else { // Return resulting trip list
        return res
            .status(200)
            .json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};