const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require(`${__dirname}/handlerFactory.js`);



exports.getOverview =catchAsync( async (req, res) => {
    const tours = await Tour.find();

    res.status(200).render('overview',{
        tours :tours
    });
})

exports.getTour = catchAsync(async(req, res, next) =>{
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        select: 'review rating user'
    })
    // console.log(tour.location);
    res.status(200).render('tour',{
        title: `${tour.name} Tour`,
        tour
    })
})

exports.getLoginForm = catchAsync(async(req, res, next) =>{
    res.status(200).render("_login", {
        title: "Login into your account"
    })
})

