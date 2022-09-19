const express = require("express");

const router = express.Router();

const {
    getTableItems,
    getTableItem,
    postItem,
    updateActorById,
    deleteActorById
} = require("../controllers/actorController");

router.get("/:schema-:table", getTableItems);

router.get("/:schema-:table/:id", getTableItem);

router.post("/:schema-:table",postItem);

router.put("/:schema-:table/:id", updateActorById);

router.delete("/:schema-:table/:id", deleteActorById);

module.exports = router;