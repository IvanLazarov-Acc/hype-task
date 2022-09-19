const express = require("express");

const router = express.Router();

const {
    getActors,
    getActorById,
    postActor,
    updateActorById,
    deleteActorById
} = require("../controllers/actorController");

router.get("/mystore-actor", getActors);

router.get("/mystore-actor/:id", getActorById);

router.post("/mystore-actor",postActor);

router.put("/mystore-actor/:id", updateActorById);

router.delete("/mystore-actor/:id", deleteActorById);

module.exports = router;