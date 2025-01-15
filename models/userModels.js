const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "There should be Name of user"]
    },
    email:{
        type: String,
        required: [true, "User's ID should be there"],
        unique: [true, 'Email already in use'],
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    photo:String,
    role: {
        type:String,
        enum: ['user','guide','lead-guide','admin'],
        default: 'user'
    },
    password:{
        type: String,
        required: [true, "User's password is required for verificaiton"],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        requird: [true, "password didn't match its confirm counter part"],
        validate: {
            // this only works on Create or Save ( validation will only occur only during save operation )
            validator: function(val){
                return this.password === val;
            },
            message: "Password doesn't match the confirm counterpart"
        }
    },
    passwordChangedAt: {
        type :Date
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

// userSchema.pre('save', function(next){
//     this.password
// })

userSchema.pre('save', async function(next){
    // Only run this function if password was actually modified
    if(!this.isModified('password')|| this.isNew)return next();

    this.passwordChangedAt = Date.now()-1000;
    next();
})
userSchema.pre('save', async function(next){
    // Only run this function if password was actually modified
    if(!this.isModified('password'))return next();
    
    // Hash the password with salt round 12
    this.password = await bcrypt.hash(this.password,12);            // hash is asynchronous
    this.passwordConfirm = undefined;
    // this.passwordChangedAt = Date.now();
    next();
})
userSchema.pre(/^find/, function(next){
    this.find({active: true});
    next();
})
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    // console.log(candidatePassword,'---------------', userPassword);
    // console.log(await bcrypt.compare(candidatePassword, userPassword),'========================');
    return await bcrypt.compare(candidatePassword, userPassword);
}
userSchema.methods.changePasswordAfter = async function(JWTTimestamp){
    // console.log(JWTTimestamp);
    // console.log(changedTimestamp,"-----------------------------");
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000);
        // console.log(changedTimestamp);
        return JWTTimestamp<changedTimestamp;        
        
    }
    // false means not changed
    return false;
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');


    this.passwordResetToken =
        crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // console.log({resetToken},this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10*60*1000;

    return resetToken;
}
const User = mongoose.model('User', userSchema);


module.exports = User;