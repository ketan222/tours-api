const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = Model =>  catchAsync(async (req, res,next)=>{
    const doc = await Model.findByIdAndDelete(req.params.id,req.body);
    if(!doc){
        console.log('we did get in here');
        return next(new appError('No tour found with that id', 404));
    }
    res.status(204).json({
        status:'success',
        data: null
    })
});

exports.updateOne = Model => catchAsync( async (req, res, next) =>{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,               // return modified document rather than normal
        runValidators: true      //  check the validators again that are mentioned in schema 
    });
    if(!doc){
        console.log('we did get in here');
        return next(new appError('No tour found with that id', 404));
    }
    // console.log(tour);
    res.status(200).json({
        status: 'success',
        data: {
            data: doc
        }
    });
});

exports.createOne = Model => catchAsync(async ( req, res, next) =>{

    const doc = await Model.create(req.body);
    res.status(201).json({
        status:'success',
        data:{
            data: doc
        }
    })
})

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) =>{
    console.log("here");
    let doc = await Model.findById(req.params.id);

    // console.log(popOptions.path);
    // console.log(popOptions.select);
    if(popOptions){
        doc = await doc.populate({
            path: popOptions.path,
            select: popOptions.select
        })
    }
    console.log('we were here');

    if(!doc){
        console.log('we did get in here');
        return next(new appError('No document found with that id', 404));
    }

    res.status(200).json({
        status: 'success',
        data:{
            data: doc
        }
    })
})

exports.getAll = (Model, popOptions) => catchAsync(async(req, res, next) =>{

    // To allow for nested GET reviews on tour (hack)
    let filter = {}
    if(req.params.tourId) filter = {tour: req.params.tourId};

    const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        
        const doc = await features.query;
        // const doc = await features.query.explain;

        res.status(200).json({
            status:'success',
            results: doc.length,
            // requestedAt: req.requestTime,
            data: {
                data: doc,
            }
        });
})