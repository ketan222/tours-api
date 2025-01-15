const express = require('express');
const tourControler = require('./../controler/tourControler.js');
const authControler = require('./../controler/authControler.js')
const reviewControler = require('../controler/reviewControler.js');
const reviewRouter = require('./../routes/reviewRoutes.js');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// Param middleware = middleware to handle specific parameters passed throught the links
// router.param('id', (req, res, next, val) =>{
//     console.log("Tour id is: ", val);
//     next();
// });

// router.param('id', tourControler.checkID);

// router.use(tourControler.checkData);

router.route('/top-5-cheap').get(tourControler.aliasTopTours, tourControler.getAllTours)

router.route('/tour-stats').get(tourControler.getTourStats);
router.route('/monthly-plan/:year').get(authControler.protect, 
    authControler.restrictTo('admin', 'lead-guide', 'guide'), tourControler.getMonthlyPlan);

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourControler.getToursWithin);
// tours-distance?distance=233&center:-40,45&unit=mi

router.route('/distances/:latlng/unit/:unit').get(tourControler.getDistances);

router
    .route('/')
    .get(tourControler.getAllTours)
    .post(authControler.protect, 
        authControler.restrictTo('admin', 'lead-guide'), 
        tourControler.createTour);


router
    .route('/:id')
    .get(tourControler.getTour)
    .patch(tourControler.updateTour)
    .delete(authControler.protect,
        authControler.restrictTo('admin', 'lead-guide'),
        tourControler.deleteTour);

// router
//     .route('/:tourId/reviews')
//     .post(
//         authControler.protect,
//         authControler.restrictTo('user'), 
//         reviewControler.createReview
//     );


module.exports = router;