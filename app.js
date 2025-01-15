const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const globalErrorHandler = require('./controler/errorControler');
const appError = require('./utils/appError')
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require(`${__dirname}/routes/tourRoutes.js`);
const userRouter = require(`${__dirname}/routes/userRoutes.js`);
const viewRouter = require(`${__dirname}/routes/viewRoutes.js`);
const reviewRouter = require(`${__dirname}/routes/reviewRoutes.js`);


const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Setsecurity http headers
app.use(helmet({

    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"]
        }
    }
}
));

// middlewares
// development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Limit req from same IP
const limiter = rateLimit({
    max: 100,                          // 100 req from same IP
    windowMs: 60 * 60 * 1000,           // in an hour
    message: "Too many req from this IP, please try again in an hour"
})

app.use('/api/',limiter);



// body parser, reading data from body into req.body
app.use(express.json({
    limit: '10kb'           // data upto 10kb is allowed
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());


// Prevent parameter pollution
app.use(hpp(
    {
        whitelist: [                                      // duplication allowed
            'duration',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price',
            'ratingsQuantity'
        ]
    }
));

// app.cors({
//     origin: process.env.WEB_URL,
//     method
// })


// serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));


// app.get('/', (req, res) =>{
//     res.status(200).json({message: "Hello from the server side!", 
//         app: 'Natours',
//     });
// })
// app.post('/', (req, res) =>{
//     res.send("You can post to this endpoint...");
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));


// route handlers




// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id/:x/:y?', (req, res) =>{
// app.get('/api/v1/tours/:id',getTour);
// app.post('/api/v1/tours',createTour);
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)

// Creating own middleware
// app.use((req, res, next) =>{
//     console.log('Hello form the middleware 😊😊😊');
//     next();
// });


// servers
app.use((req, res, next) =>{
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

// route
// Mounting a new router on a route


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/', viewRouter);


app.all('*',(req, res, next)=>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl}...`
    // });

    // const err = new Error(`Can't find ${req.originalUrl}`);
    // err.status = 'fail',
    // err.statusCode = 404,



    next(new appError(`Can't find ${req.originalUrl}`,404));
});

app.use(globalErrorHandler);

module.exports = app;