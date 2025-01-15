const express = require('express');
const tourControler = require('./../controler/tourControler.js');
const authControler = require('./../controler/authControler.js')
const reviewControler = require('../controler/reviewControler.js');

const router = express.Router({ mergeParams:true });

router.use(authControler.protect);

router.route('/').get(reviewControler.getAllReviews);
router.route('/')
    .post(
        authControler.protect,
        authControler.restrictTo('user'),
        reviewControler.setTourUserIds,
        reviewControler.createReview
    );

router.route('/:id')
    .get(reviewControler.getReview)
    .patch(authControler.restrictTo('user', 'admin'),reviewControler.updateReview)
    .delete(authControler.restrictTo('user', 'admin'),reviewControler.deleteReview);

module.exports = router;