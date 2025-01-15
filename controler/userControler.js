const fs = require('fs');
// const ser = require('./../models/userModels');
const User = require('./../models/userModels');
const catchAsync = require('../utils/catchAsync');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const appError = require('./../utils/appError');
const { createSearchParams } = require('react-router-dom');
const factory = require('./handlerFactory.js');



const filterObj = (obj, ...allowedFields) =>{
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el];
        }
    })
    return newObj;
}


// exports.getAllUsers = catchAsync(async (req, res) =>{


//     const users = await User.find();
//     console.log(users);


//     res.status(200).json({
//         status:'success',
//         results: users.length,
//         // requestedAt: req.requestTime,
//         data: {
//             users
//         }
//     });
// });

exports.getAllUsers = factory.getAll(User);

// exports.getUser = (req, res) =>{
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

exports.getUser = factory.getOne(User);

exports.createUser = (req, res) =>{
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    })
};

// exports.createUser = factory.createOne(User);

// exports.updateUser = (req, res) =>{
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

exports.updateUser = factory.updateOne(User);

// exports.deleteUser = (req, res) =>{
//     res.status(500).json({
//         status: 'error',
//         message: 'This route is not yet defined'
//     })
// };

exports.deleteUser = factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next)=>{
    // console.log("we did enter here");
    // 1) create error if user POSTS password data
    // console.log(req.body.password || req.body.passwordConfirm);
    if(req.body.password || req.body.passwordConfirm){
        return next(new appError('This route is not for password updates. Please use /updateMyPassword.',400));
    }

    // 2) filtered out the fields that need not to be disturbed
    const filteredBody = filterObj(req.body, 'name', 'email');
    
    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        status:'success',
        data:{
            user: updatedUser
        }
    });

});


exports.deleteMe = catchAsync(async (req, res, next)=>{
    await User.findByIdAndUpdate(req.user._id, {active: false});
    res.status(204).json({
        status:'success',
        data: null
    })
});

exports.getMe = catchAsync(async(req, res, next) =>{
    req.params.id = req.user.id;
    next();
});