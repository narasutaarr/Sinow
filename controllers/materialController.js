exports.getAllMaterials = (req, res) => res.json({ message: "get all materials" });
exports.getMaterialById = (req, res) => res.json({ message: `get material ${req.params.id}` });
exports.createMaterial = (req, res) => res.json({ message: "create material" });
exports.updateMaterial = (req, res) => res.json({ message: `update material ${req.params.id}` });
exports.deleteMaterial = (req, res) => res.json({ message: `delete material ${req.params.id}` });