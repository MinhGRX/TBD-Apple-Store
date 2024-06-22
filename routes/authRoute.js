const express = require('express');
const { createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updatedAUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/forgot-password-token", forgotPasswordToken);

router.get("/all-users", getAllUser);   // Dev purpose only
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getAUser);

router.delete("/:id", authMiddleware, isAdmin, deleteAUser);

router.put("/edit-user", authMiddleware, updatedAUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/password", authMiddleware, updatePassword);
router.put("/reset-password/:token", resetPassword);


module.exports = router;    