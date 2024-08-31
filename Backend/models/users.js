const { createHmac, randomBytes, hash } = require('crypto');
const {Schema,model, default: mongoose} = require("mongoose");
const { createTokenForUser } = require('../services/authentication');
const userSchema = new Schema({
    fullName: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true,
    },
    salt: {
        type:String,
    },
    password : {
        type:String,
        required:true,
    },
    role: {
        type:String,
        enum : ["USER","ADMIN"],
        default:"USER",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        token: String,
        expiration: Date,
    },
    totalLikes: {
        type: Number,
        default: 0,
    },
    totalBlogs : {
        type: Number,
        default: 0,
    },
    profilePhoto: {
        type: String,
        default: "https://res.cloudinary.com/dufs5ty9i/image/upload/v1725126023/tytzucezfonnjwomiuth.png",
    },
    passwordResetToken: {
        otp: String,
        expiration: Date,
    },
},{timestamps:true});

userSchema.pre("save",function(next){
    const user= this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256",salt)
    .update(user.password).digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
    next();
})

userSchema.static("matchPasswordAndGenerateToken", async function(email,password) {
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found!');

    const salt = user.salt; 
    const hashedPassword = user.password;

    const userProvidedHash = createHmac("sha256",salt)
    .update(password).digest("hex");

    if(hashedPassword !== userProvidedHash) throw new Error ('Password not matched');

    const token = createTokenForUser(user);
    return token;
});

const User = model('user',userSchema);

module.exports = User; 