const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');
const crypto = require('crypto');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    cart:{
        type:Array,
        default:[],
    },
    address:[{ type: mongoose.Schema.Types.ObjectId , ref: "Address" }],
    wishlist:[{ type: mongoose.Schema.Types.ObjectId , ref: "Product" }],
    refreshToken:{
        type: String,
    },
    passwordChangedAt: {type: Date},
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
},
{
    timestamps: true,
});


userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    if (!this.isNew) {
        // Set passwordChangedAt to current time (adjusting slightly to ensure it is always updated)
        this.passwordChangedAt = Date.now() - 1000; // Adjust by 1 second to account for token generation delays
    }
    next();
});

userSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;    // 30 minutes
    return resetToken;
};

//Export the model
module.exports = mongoose.model('User', userSchema);