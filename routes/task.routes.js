const router = require("express").Router();
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/task.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

router.post("/",      protect, authorize("admin"), createTask);           // POST   /api/tasks
router.get("/",       protect, getTasks);                                  // GET    /api/tasks
router.patch("/:id",  protect, authorize("admin"), updateTask);           // PATCH  /api/tasks/:id
router.delete("/:id", protect, authorize("admin"), deleteTask);           // DELETE /api/tasks/:id

module.exports = router;
