const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        try {
            if(token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);

                // Log for debugging
                // console.log("decoded id:", decoded.id);
                // console.log("user:", user);

                if (!user) {
                    return res.status(401).json({ message: "User not found" });
                }

                req.user = user;
                next();
            }
        } catch (error) {
            res.status(401).json({ message: "Not Authorized, token expired. Please Login again!" });
        }
    } else {
        res.status(401).json({ message: "No token attached to header!" });
    }
});

const isAdmin = asyncHandler(async(req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if(adminUser.role != "admin") {
        throw new Error("You are not the Admin!");
    } else {
        next();
    }
});

module.exports = {
    authMiddleware,
    isAdmin
};