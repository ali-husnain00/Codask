import jwt from "jsonwebtoken";
import { sendError } from "../utils/response.js";

const verifyToken = (req, res, next) =>{
    const token = req.cookies.token;

    if(!token){
        return sendError(res, 401, "Access denied", "UNAUTHORIZED");
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return sendError(res, 403, "Invalid token", "INVALID_TOKEN");
    }
}

export default verifyToken