import { User } from "../models/User.js";

class userController {
  async getTodos(req, res) {
    try {
      const foundUser = await User.findById(req.userId, { todolists: 1 }); //тут смысла нету проверять есть ли такой юзер, в мидлваре уже есть или ошбика или все ок, оно передастся сюда
      res.status(200).json(foundUser.todolists);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async postTodo(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.userId,
        {
          $push: { todolists: { title: req.body.title } },
        },
        { returnDocument: "after" }
      );
      res.status(201).json(user.todolists.at(-1));
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async deleteTodo(req, res) {
    try {
      await User.findByIdAndUpdate(req.userId, {
        $pull: { todolists: { _id: req.params.id } },
      });
      res.status(200).json({ _id: req.params.id });
      // тут есть мини (бэк) проблема, что всегда 204, даже если был удален туду, ибо возврщается весь юзер, а его никто не удаляет
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async updateTodoTitle(req, res) {
    try {
      await User.findOneAndUpdate(
        { _id: req.userId, "todolists._id": req.params.id },
        { $set: { "todolists.$.title": req.body.title } }
      );
      res.status(200).json({ _id: req.params.id, title: req.body.title });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async changeTodoFilter(req, res) {
    try {
      await User.findOneAndUpdate(
        { _id: req.userId, "todolists._id": req.params.id },
        { $set: { "todolists.$.filter": req.body.filter } }
      );
      console.log(req.params.id, req.body.filter);
      res.status(200).json({ _id: req.params.id, filter: req.body.filter });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async postNewTask(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.userId, "todolists._id": req.params.id },
        { $push: { "todolists.$.tasks": req.body } },
        { returnDocument: "after" }
      );
      const parsedUser = JSON.parse(JSON.stringify(user));
      const foundTodo = parsedUser.todolists.find(
        (tl) => tl._id === req.params.id
      );
      const addedTask = foundTodo.tasks.at(-1);
      res.status(200).json({
        _id: addedTask._id,
        todoId: req.params.id,
        title: req.body.title,
        isDone: addedTask.isDone,
        description: addedTask.description,
        date: addedTask.date,
        images: addedTask.images,
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  async patchTask(req, res) {
    if (req.files.length !== 0) {
      try {
        const parsedData = JSON.parse(req.body.data);
        const imagesNames = req.files.map((f) => f.filename);
        const user = await User.findOneAndUpdate(
          { _id: req.userId },
          {
            $set: {
              //меняю свойства, а не объект, чтобы не изменилась айдишка
              "todolists.$[todo].tasks.$[task].title": parsedData.title,
              "todolists.$[todo].tasks.$[task].isDone": parsedData.isDone,
              "todolists.$[todo].tasks.$[task].description":
                parsedData.description,
              "todolists.$[todo].tasks.$[task].date": parsedData.date,
              "todolists.$[todo].tasks.$[task].images": imagesNames,
            },
          },
          {
            arrayFilters: [
              { "todo._id": req.params.todoId },
              { "task._id": req.params.taskId },
            ],
            returnDocument: "after",
          }
        );
        const parsedUser = JSON.parse(JSON.stringify(user));

        const foundTodo = parsedUser.todolists.find(
          (tl) => tl._id === req.params.todoId
        );
        const foundTask = foundTodo.tasks.find(
          (t) => t._id === req.params.taskId
        );
        res.status(200).json({
          title: foundTask.title,
          isDone: foundTask.isDone,
          description: foundTask.description,
          date: foundTask.date,
          images: foundTask.images,
          todoId: req.params.todoId,
          taskId: foundTask._id,
        });
      } catch (e) {
        res.status(400).json({ message: e.message });
      }
    } else {
      try {
        const parsedData = JSON.parse(req.body.data);
        const user = await User.findOneAndUpdate(
          { _id: req.userId },
          {
            $set: {
              //меняю свойства, а не объект, чтобы не изменилась айдишка
              "todolists.$[todo].tasks.$[task].title": parsedData.title,
              "todolists.$[todo].tasks.$[task].isDone": parsedData.isDone,
              "todolists.$[todo].tasks.$[task].description":
                parsedData.description,
              "todolists.$[todo].tasks.$[task].date": parsedData.date,
            },
          },
          {
            arrayFilters: [
              { "todo._id": req.params.todoId },
              { "task._id": req.params.taskId },
            ],
            returnDocument: "after",
          }
        );
        const parsedUser = JSON.parse(JSON.stringify(user));

        const foundTodo = parsedUser.todolists.find(
          (tl) => tl._id === req.params.todoId
        );
        const foundTask = foundTodo.tasks.find(
          (t) => t._id === req.params.taskId
        );
        res.status(200).json({
          title: foundTask.title,
          isDone: foundTask.isDone,
          description: foundTask.description,
          date: foundTask.date,
          images: foundTask.images,
          todoId: req.params.todoId,
          taskId: foundTask._id,
        });
      } catch (e) {
        res.status(400).json({ message: e.message });
      }
    }
  }
  async deleteTask(req, res) {
    try {
      await User.findOneAndUpdate(
        { _id: req.userId, "todolists._id": req.params.todoId },
        { $pull: { "todolists.$.tasks": { _id: req.params.taskId } } }
      );
      res.status(200).json({
        taskId: req.params.taskId,
        todoId: req.params.todoId,
      });
      // тут есть мини проблема (бэк), что всегда 204, даже если был удален таск, ибо возврщается весь юзер, а его никто не удаляет
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

export default new userController();
