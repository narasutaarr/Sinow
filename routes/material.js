const express = require("express");
const router = express.Router();

const {
    getAllMaterials,
    getMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial
} = require("../controllers/materialController");

// get semua materi
router.get("/", getAllMaterials);

// get materi by id
router.get("/:id", getMaterialById);

// create materi baru
router.post("/", createMaterial);

// update materi by id
router.put("/:id", updateMaterial); 

// delete materi by id
router.delete("/:id", deleteMaterial);

module.exports = router;