import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const auth = (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ error: "Unauthorized - no token provided" });
    }

    try {
        const decoded = jwt.verify(token, config.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized - invalid token" });
    }
};
