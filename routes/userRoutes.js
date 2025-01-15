const express  = require('express');
const userControler = require('./../controler/userControler.js');
const authControler = require('./../controler/authControler.js');
const reviewControler = require('./../controler/reviewControler.js');

const router = express.Router();

// router.use(authControler.protect);

router.post('/signup',authControler.signup);
router.post('/login',authControler.login);
router.post('/forgotPassword',authControler.forgotPassword);
router.patch('/resetPassword/:token',authControler.resetPassword);

router.use(authControler.protect);

router.patch('/updateMyPassword',authControler.protect, authControler.updatePassword);
router.patch('/updateMe', authControler.protect, userControler.updateMe);
router.delete('/deleteMe', authControler.protect, userControler.deleteMe);

router.get('/me',
    authControler.protect,
    userControler.getMe,
    userControler.getUser
)

router.use(authControler.restrictTo('admin'));

router
    .route('/')
    .get(userControler.getAllUsers)
    .post(userControler.createUser);

router
    .route('/:id')
    .get(userControler.getUser)
    .patch(userControler.updateUser)
    .delete(userControler.deleteUser)


module.exports =  router;