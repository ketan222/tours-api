const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const Review = require('../models/reviewModel.js');
const factory = require('./handlerFactory.js');

exports.setTourUserIds = (req, res, next) =>{
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

// exports.getAllReviews = catchAsync( async (req, res, next) =>{


//     let filter = {}
//     if(req.params.tourId) filter = {tour: req.params.tourId};

//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         status:"success",
//         results: reviews.length,
//         data:{
//             reviews
//         }
//     });
// });

exports.getAllReviews = factory.getAll(Review);

// exports.createReview = catchAsync(async(req, res, next) =>{
    
//     const newReview = await Review.create(req.body);
//     res.status(201).json({
//         status:'success',
//         data:{
//             review: newReview
//         }
//     })
// });

exports.createReview = factory.createOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.getReview = factory.getOne(Review);