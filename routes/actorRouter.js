const express = require("express");

const router = express.Router();

const {
    getTableItems,
    getTableItem,

    postItem,
    updateItemById,
    deleteItemById
} = require("../controllers/actorController");

router.get("/:schema-:table", getTableItems);
router.get("/:schema-:table/download=:true", getTableItems);

router.get("/:schema-:table/:id", getTableItem);

router.post("/:schema-:table",postItem);

router.put("/:schema-:table/:id", updateItemById);

router.delete("/:schema-:table/:id", deleteItemById);

module.exports = router;