import { model, Schema } from "mongoose";

const userSchema = Schema({
  nickname: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  todolists: [
    {
      title: { type: String, required: true },
      filter: { type: String, default: "All" },
      tasks: [
        {
          title: { type: String, required: true },
          isDone: { type: Boolean, default: false },
          description: { type: String, default: "" },
          date: { type: String, default: "" },
          images: [
            {
              type: String,
            },
          ],
        },
      ],
    },
  ],
});

export const User = model("User", userSchema);
