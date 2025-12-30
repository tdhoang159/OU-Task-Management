import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (request, response, next) => {
  try {
    const token = request.headers.authorization.split(" ")[1]; //Bearer dhghjhdkjfg

    if (!token) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return response.status(401).json({
        message: "Unauthorized",
      });
    }
    console.log(user);

    request.user = user;
    next();
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: "Internal server error",
    });
  }
};

export default authMiddleware;
