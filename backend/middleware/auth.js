import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authenticateToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

export function authorizeRoles(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res
        .status(403)
        .json({ message: "Access forbidden: insufficient role privileges" });
    }
    next();
  };
}

const { verify } = jwt;

export default async function auth(req, res, next) {
    try {
        let token = req.headers.authorization.split(" ")[1];
        let details = await verify(token, process.env.JWT_SECRET);
        if(details) {
            req.user = details;
            next();
            return;
        }
        return res.status(403).json({ msg: "Forbidden"});
    } catch (error) {
        console.log(error);
        return res.status(403).json({ msg: "Forbidden"});
    }
}

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
