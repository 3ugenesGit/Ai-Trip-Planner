const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createTrip, getTrips, getTripById, updateTrip, deleteTrip } = require("../controllers/tripController");
const { generateItinerary } = require("../controllers/aiController");

router.post("/", auth, createTrip);
router.post("/generate", auth, generateItinerary);
router.get("/", auth, getTrips);
router.get("/:id", auth, getTripById);
router.put("/:id", auth, updateTrip);
router.delete("/:id", auth, deleteTrip);
module.exports = router;