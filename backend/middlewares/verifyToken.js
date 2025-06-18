import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) =>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).send("Access denied!")
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).send("Invalid token!");
        console.log(error);
    }
}

export default verifyToken