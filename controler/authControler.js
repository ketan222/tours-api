const User = require('./../models/userModels')
const catchAsync = require('./../utils/catchAsync')
const jwt = require('jsonwebtoken');
const appError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const {promisify} = require('util');
const crypto = require('crypto');
const bcrypt =require('bcryptjs');

const signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next)=>{
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passowordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });

    const token = signToken(newUser._id);
    const cookieOptions = 
        {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            // secure: true,                // cookie will be sent in secure way (https)
            httpOnly: true
        }
   

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)

    // user.password=undefined;
    res.status(200).json({
        status: 'success',
        token,
        data:{
            newUser
        }
    });
});


exports.login = catchAsync(async(req, res, next) =>{
    const {email,password} = req.body;
    
    // 1. Check if email and password exists
    if(!email || !password){
        // console.log("-----------------------------------------");
        return next(new appError('please provide email and password', 400));
    }

    // 2. Check if user and passwords are correct
    const user = await User.findOne({email: email}).select('+password');
    // console.log(user);
    
    
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new appError('Incorrect email or password',401));
    }
    
    // const correct = await user.correctPassword(password, user.password);

    // 3. If everything ok, send token to client
    const token= signToken(user._id);
    const cookieOptions = 
        {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            // secure: true,                // cookie will be sent in secure way (https)
            httpOnly: true
        }
   

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)
    res.status(200).json({
        status: 'success',
        token
    })
});



exports.protect = catchAsync(async(req, res, next) =>{
    let token;
    // console.log('we did enter here');


    // 1. Getting jwt token and check if it's there
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);
    if(!token){
        return next(new appError("You are not logged in, please login to get access",401));
    }



    // 2. Validate jwt token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded);



    // 3. check if user still exits
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new appError("The user belonging to this token doesn't exists!", 401));
    }

    

    // 4. Check if user changed password after the jwt token was issued
    console.log(decoded);
    // console.log(currentUser.changePasswordAfter(decoded.iat));
    if(await currentUser.changePasswordAfter(decoded.iat)){
        return next(new appError('User recently changed password! Please login again',401));
    };


    // Grant Access to the protected route
    req.user = currentUser;
    next();
});


exports.restrictTo = (...roles)=>{
    return (req, res, next)=>{
        // roles is an array['admin','lead-guide']
        if(!roles.includes(req.user.role)){
                return next(new appError("You do not have permission to perform this action", 403));
        };
        next();
    }
}


exports.forgotPassword = catchAsync(async(req, res, next)=>{
    // 1) Get user based on posted email 
    const user = await User.findOne({email: req.body.email})
    console.log("yes we did reach here");
    if(!user){
        return next(new appError('There is no user with email address.',404));
    }

    // 2) Generate the random reset password
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave : false});

    // 3) send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIF you didn't forget your password, please ignore this email`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Your password reset valid token( 10 min )',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    }catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetExpires = undefined;
        
        console.log(err);
        await user.save({
            validateBeforeSave: false
        })
        return next(
            new appError("There was an error sending the email. Try again later!",500)
        )
    }
        
});


exports.resetPassword = async (req, res, next)=>{
    // 1) Get user based on the token
    const hashedToken = crypto
                            .createHash('sha256')
                            .update(req.params.token)
                            .digest('hex');

    

    // 2) if token has not expired, and there is user, set the new password
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{ $gt: Date.now()}});
    if(!user){
        return next(new appError("Token is invalid or has expired",400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires= undefined;
    await user.save();


    // 3) update changedPasswordAt property for the user






    // 4) log the user in, send jwt
    const token = signToken(user._id);
    const cookieOptions = 
        {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            // secure: true,                // cookie will be sent in secure way (https)
            httpOnly: true
        }
   

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)

    res.status(200).json({
        status: 'success',
        token
    })
}


exports.updatePassword = catchAsync(async(req, res, next)=>{
    // 1) Get user from collection
    const user = await User.findById(req.user._id).select('+password');
    // if(!user){
    //     return next(new appError('No such user with this name in database', 402));
    // }

    // 2) Check is posted password is correct
    // console.log(user.password);
    // console.log(req.body.passwordCurrent,'-----------------------',user.password);
    // console.log(user.correctPassword(req.body.passwordCurrent, user.password), "+++++++++++++");
    if(!await user.correctPassword(req.body.passwordCurrent, user.password)){
        return next(new appError('Your current password is wrong!'),404);
    }


    // 3) if so, then update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();



    // 4) Log the user in, send JWT
    const token = signToken(user._id);
    const cookieOptions = 
        {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            // secure: true,                // cookie will be sent in secure way (https)
            httpOnly: true
        }
   

    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions)
    res.status(200).json({
        status: 'success',
        token
    })
})