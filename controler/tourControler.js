// const fs = require('fs');

const { query } = require("express");
const APIFeatures = require(`./../utils/apiFeatures`)
const catchAsync = require(`./../utils/catchAsync`)
const appError = require('./../utils/appError')
const factory = require('./handlerFactory')


// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const Tour = require(`${__dirname}./../models/tourModel`);


exports.aliasTopTours = (req, res, next)=>{
    // console.log('yes');
    req.query.limit = '5';
    req.query.sort = '-ratingAverage,price';
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
    // console.log(req.query);
    next();
}

// exports.checkID = (req, res, next, val)=>{
//     if(req.length < req.params.id*1){
//         return res.status(404).json({
//             status: "Failed",
//             message: "no such id"
//         })
//     }
//     next();
// }



// Middleware function
// exports.getAllTours = catchAsync(async (req, res,next) =>{
//     const features = new APIFeatures(Tour.find(), req.query)
//             .filter()
//             .sort()
//             .limitFields()
//             .paginate();
        
//         const tours = await features.query;

//         res.status(200).json({
//             status:'success',
//             results: tours.length,
//             // requestedAt: req.requestTime,
//             data: {
//                 tours: tours,
//             }
//         });
//     // try{
//     //     // const queryObj = {...req.query};
//     //     // const excludedFields = ['page','sort','limit', 'fields'];
//     //     // excludedFields.forEach(el => delete queryObj[el]);
//     //     // // console.log(req.query,queryObj);

//     //     // let queryStr = JSON.stringify(queryObj);
//     //     // queryStr=queryStr.replace(/\b{gte|gt|lte|lt}\b/g, match => `$${match}`);             // b ensures that word is next to a non-word charcter (such as space punctuation, etc)
//     //     // // console.log(JSON.parse(queryStr), 'sldjfsd');

        
//     //     // const tours = await Tour.find({                  // method to write query string
//     //     //     duration: 5,
//     //     //     difficulty: 'easy'
//     //     // });
        
//     //     // let query = Tour.find(JSON.parse(queryStr));           // methode to write query string
        
//     //     // // Sorting
//     //     // // console.log(req.query.sort);
//     //     // if(req.query.sort){
//     //     //     const sortBy = req.query.sort.split(',').join(' ');
//     //     //     // console.log(sortBy);
//     //     //     // query = query.sort(req.query.sort);
//     //     //     query = query.sort(sortBy);
//     //     //     // sort('price ratingAverage');                    // if price are same then move to next parameter for sorting
//     //     // }
//     //     // else{
//     //     //     query.sort('-createdAT');
//     //     // }


//     //     // Field limiting
//     //     // if(req.query.fields){
//     //     //     const fields = req.query.fields.split(',').join(' ');
//     //     //     query = query.select(fields);
//     //     // }
//     //     // else{
//     //     //     query = query.select('-__v');           // exclude __v field
//     //     // }


        

//     //     // {duration: {$gte: 5}, difficulty: 'easy'}

//     //     // const tours = await Tour                            // another method to write query stringv
//     //     //                         .find()
//     //     //                         .where('duration')
//     //     //                         .equals(5)
//     //     //                         .where('difficulty')
//     //     //                         .equals('easy');

        
//     // }catch(err){
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     })
//     // }
// });

exports.getAllTours = factory.getAll(Tour);

// exports.getTour = catchAsync(async (req, res,next) =>{
//     const tour = await Tour.findById(req.params.id).populate({
//         path: 'reviews',
//         select: '-tour -user'
//     });
//     console.log('we were here');
//     if(!tour){
//         console.log('we did get in here');
//         return next(new appError('No tour found with that id', 404));
//     }

//     res.status(200).json({
//         status: 'success',
//         data:{
//             tour
//         }
//     })
//     // try{
        

//     // }catch(err){
//     //     res.status(400).json({
//     //         status: 'fail',
//     //         message: err
//     //     })
// // 
//     // }
//     // console.log(req.params);
//     // const id= Number(req.params.id * 1);        // convert number
//     // const tour = tours.find(el => el.id === id);
//     // res.status(200).json({
//     //     status: 'success',
        
//     //     data: {
//     //         tours: tour,
//     //     }
//     // })
// });

exports.getTour = factory.getOne(Tour, {path: 'reviews', select:'-user -tour'})

// exports.checkBody = (req, res, next)=>{
//     console.log(!req.body.name);
//     if((!req.body.name) || (!req.body.price)){
//         return res.status(400).json({
//             status: "fail",
//             message: "Body doesn't contain name and price"
//         })
//     }
//     next();
// }

// exports.createTour = catchAsync(async (req, res,  next )=>{
//     const newTour = await Tour.create(req.body);
//         res.status(201).json({
//             status: 'success',
//             data: {
//                 tour: newTour
//             }
//         })

//     // try{

//     //     // const newTour = new Tour({});
//     //     // newTour.save();
        
//     // } catch(err){
//     //     res.status(400).json({
//     //         status: 'fail',
//     //         message: 'Invalid Dataset'
//     //     })
//     // }

//     // console.log(req.body);
//     // checkData(req);

//     // const newId = tours[tours.length-1].id+1;
//     // const newTour = Object.assign({id: newId}, req.body);

//     // tours.push(newTour);

//     // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
//     //     res.status(201).json({
//     //         status: 'success',
//     //         data: {
//     //             tour: newTour,
//     //         }
//     //     })
//     // });
//     // res.end('done');
// });

exports.createTour = factory.createOne(Tour);

// exports.updateTour =  catchAsync(async (req, res,next) =>{
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,               // return modified document rather than normal
//         runValidators: true      //  check the validators again that are mentioned in schema 
//     });
//     if(!tour){
//         console.log('we did get in here');
//         return next(new appError('No tour found with that id', 404));
//     }
//     // console.log(tour);
//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour
//         }
//     });
//     // try{
//     // }catch(err){
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     })
//     // }
//     // console.log(req.params);
//     // const id = Number(req.params.id);
    
//     // console.log(req.body);
//     // tours[id].duration = req.body.duration;
//     // console.log(tours[id].duration);
// });

exports.updateTour = factory.updateOne(Tour);

// exports.deleteTour = catchAsync(async (req, res,next)=>{
//     const tour = await Tour.findByIdAndDelete(req.params.id,req.body);
//     if(!tour){
//         console.log('we did get in here');
//         return next(new appError('No tour found with that id', 404));
//     }
//     res.status(204).json({
//         status:'success',
//         data: null
//     })
//     // try{

//     // }catch(err){
//     //     res.status(404).json({
//     //         status: 'fail',
//     //         message: err
//     //     })
//     // }
// });

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res,next) =>{
    const stats = await Tour.aggregate([
        {
            $match: {ratingsAverage : {$gte: 4.5}}
        },
        {
            $group: {
                _id: {$toUpper: '$difficulty'},
                numRatings: {$sum: '$ratingsQuantity'},
                numTours: {$sum: 1},
                avgRating: {$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
            }
        },
        {
            $sort: {avgPrice:1}
        },
        // {
        //     $match: { _id: {$ne: 'EASY'}}
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
    // try{
    // }catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
})

exports.getMonthlyPlan =catchAsync( async (req, res) =>{
    const year = req.params.year*1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates:{
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group:{
                _id: {
                    $month: '$startDates'
                },
                numTourStart: {$sum: 1},
                tours: {$push: '$name'}
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        },
        {
            $project:{
                _id: 0,

            }
        },
        {
            $sort:{
                numTourStart:-1
            }
        },
        {
            $limit:12
        }
    ]);

    res.status(200).json({
        status: 'success',
        data:{
            plan
        }
    })
    // try{
    // }catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
})

exports.getToursWithin = catchAsync(async (req, res, next) =>{
    const {distance, latlng, unit} = req.params;
    const [lat, lng] = latlng.split(',');
    if(!lat || !lng){
        next( new appError('Please provide latitude and longitude in the format lat,lng.',400));
    }

    const radius = unit === 'mi'? distance/3963.2: distance/6378.1;

    const tours = await Tour.find(
        {
            startLocation: {
                 $geoWithin : { 
                    $centerSphere: [[lng,lat], radius]}
        }
    }
    );

    console.log(distance, lat, lng, unit);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })

})

exports.getDistances = catchAsync( async (req, res, next) =>{
    const {latlng,unit} = req.params;
    // console.log(latlng);
    const [lat, lng] = latlng.split(',');
    // console.log(lat, lng);

    const multiplier = unit === 'mi'? 0.000621371: 0.001;

    if(!lat || !lng){
        next ( new appError('Please provide latitude and longitude in the format lat, lng.',400));
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng*1, lat*1]
                },
                distanceField: 'distance', 
                distanceMultiplier: multiplier
                
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);
    res.status(200).json({
        status: "success",
        data: {
            distances
        }
    })
})