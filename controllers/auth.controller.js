import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateAccessToken = (id) => {
  const payload = { id };
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });
};

class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Check the length of nickname or password" });
      }
      const { nickname, password } = req.body;
      const canditate = await User.findOne({ nickname });
      if (canditate) {
        return res
          .status(400)
          .json({ message: "This nickname is already taken" });
      }
      const hashedPassword = bcrypt.hashSync(password, 5);
      const user = new User({ nickname, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "You have been registered" });
    } catch (e) {
      res.status(500).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    const { nickname, password } = req.body;
    const candidate = await User.findOne({ nickname });
    if (!candidate) {
      return res.status(400).json({ message: "Wrong password or nickname" });
    }
    const validPassword = bcrypt.compareSync(password, candidate.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password or nickname" });
    }
    const token = generateAccessToken(candidate._id);
    res.status(200).json({ nickname: candidate.nickname, token });
  }
  async getMe(req, res) {
    try {
      const me = await User.findById(req.userId, { password: 0 });
      if (!me) {
        return res.status(403).json({ message: "No such user" }); //если из бд удалить чела пока он зареган, то надо код ответа 403 для интерцептора
      }
      const token = generateAccessToken(me._id);
      res.json({ nickname: me.nickname, token, message: "You are authorized" });
    } catch (e) {
      res.status(403).json({ message: e.message });
    }
  }
}

export default new authController();
