const express = require('express');
const { createUser, loginUserCtrl, getAllUser, getAUser, deleteAUser, updatedAUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword } = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.get("/all-users", getAllUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getAUser);
router.delete("/:id", deleteAUser);
router.put("/edit-user", authMiddleware, updatedAUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
router.put("/password", authMiddleware, updatePassword);



module.exports = router;    