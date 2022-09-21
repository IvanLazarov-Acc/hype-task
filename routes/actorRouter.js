const express = require("express");

const router = express.Router();

const {
    getTableItems,
    getTableItem,
    // getTableItemByParameters,
    postItem,
    updateItemById,
    deleteItemById
} = require("../controllers/actorController");

router.get("/:schema-:table", getTableItems);
// router.get("/:schema-:table/:download", getTableItems);

router.get("/:schema-:table/:id", getTableItem);

// router.get("/:schema-:table/:id&:first_name&:last_name", getTableItemByParameters);

router.post("/:schema-:table",postItem);

router.put("/:schema-:table/:id", updateItemById);

router.delete("/:schema-:table/:id", deleteItemById);

module.exports = router;