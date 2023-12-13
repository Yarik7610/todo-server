import { Router } from "express";
import multer from "multer";
import userController from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export const userRouter = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

userRouter
  .route("/todos")
  .get(authMiddleware, userController.getTodos)
  .post(authMiddleware, userController.postTodo);
userRouter
  .route("/todos/:id")
  .delete(authMiddleware, userController.deleteTodo)
  .patch(authMiddleware, userController.updateTodoTitle)
  .put(authMiddleware, userController.changeTodoFilter)
  .post(authMiddleware, userController.postNewTask);
userRouter
  .route("/todos/:todoId/tasks/:taskId")
  .patch(authMiddleware, upload.array("images", 3), userController.patchTask)
  .delete(authMiddleware, userController.deleteTask);
