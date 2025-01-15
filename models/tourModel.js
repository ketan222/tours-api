const User = require('./userModels');
const mongoose = require('mongoose');
const { defaultMaxListeners } = require('nodemailer/lib/xoauth2');
const slugify = require('slugify');
const validator = require('validator');
// const Review = require('./reviewModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour name must have less or equal 40 characters'],
        minlength: [10, 'A tour name must have more or equal 10 characters'],
        // validate: [validator.isAlphanumeric,"A tour name should be aplha numeric"]
    },
    slug: {
        type: String
    },
    duration: {
        type: Number, 
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'difficulty is either easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1,'Rating must be above 1.0'],
        max: [5,'Rating must be below 5.0'],
        set: val=> Math.round(val*10)/10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val){
                // this points to current document(i.e new document that we are creating) so it is not gonna work in case of update(patch)
                return val<this.price;
            },
            message: 'Discount price ({VALUE})should be below the regular price'
        }
    },
    summary: {
        type: String,
        trim: true,                   // remove spaces from front and end of sentence
        required: [true, "A tour must have a description"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour msut have a cover image"]
    },
    images: [String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select: false                // not default output of get document data
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation:{
        // embaded object
        type:{
            type: String,
            default: 'Point',
            enum:['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    location: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ["Point"],
            }        ,
            coordinates: [Number],
            address:String,
            description:String,
            day: Number
        }
    ],
    guides:[
        // referencing
        {
            type: mongoose.Schema.ObjectId,
            ref:"User"
        }
    ]
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
});


tourSchema.index({price: 1, ratingsAverage:-1});
tourSchema.index({slug:1});
tourSchema.index({startLocation: '2dsphere'});

tourSchema.virtual('durationWeeks').get(function(){
    return this.duration/7;
})



// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

// Document middleware: runs before .save() and .create() not for update()
tourSchema.pre('save', function(next){                     // save = hook, pre save hook/middleware
    this.slug = slugify(this.name, {lower: true});
    next();
});


// tourSchema.pre('save',async function(next){
    //     console.log(this.guides);
    //     const guidesPromise = this.guides.map(async el => await User.findById(el));
    //     // console.log(guidesPromise);
    //     console.log(await Promise.all(guidesPromise));
    //     this.guides = await Promise.all(guidesPromise);
    //     // console.log(this.guides);
    //     next();
    // })
    
    
    // tourSchema.pre('save',function(next){
        //     console.log('Will save document...');
        //     next();
        // })
        // tourSchema.post('save', function(next){                    // post save hook/middleware
        //     console.log(doc);
        //     next();
        // })
        
        
        // Query Middleware
        // tourSchema.pre('find', function(next) {
            tourSchema.pre(/^find/, function(next) {                // for every hook that starts with find
                this.find({
                    secretTour: {$ne: true}
                });
                this.start = Date.now();
                next();
            })
            tourSchema.pre(/^find/, function( next){
                this.populate({
                    path:'guides',
                    select: '-__v -passwordChangedAt'
                });
                next();
            })
            tourSchema.post(/^find/, function(docs, next) {                // for every hook that starts with find
                console.log('Query took',Date.now()-this.start);
                // console.log(docs);
                next();
            })

// Aggregation Middleware
// tourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({
//         $match:{
//             secretTour: {$ne: true}
//         }
//     })
//     next();
// })

const Tour = mongoose.model('Tour', tourSchema);      // 'Tour' is the name of collection inside natours where we want this model to save this document


module.exports = Tour;