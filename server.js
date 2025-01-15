const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err =>{
    console.log(err.name, err.message);
    console.log('Unhandled Exception💥, Shutting down...'); 
    process.exit(1);
});

dotenv.config({path: './config.env'});
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const app = require('./app');


// mongoose.connect(db)
mongoose.connect(process.env.DATABASE_LOCAL)          // local database connection
.then(con => {
    // console.log(con.connections);
    console.log("DB connection successful! ");
})



// console.log(app.get('env'));      // environment we are currently in
// console.log(process.env);

// start the server
const port = process.env.port;
const server = app.listen(port, ()=>{
    console.log(`App running onport ${port}...`);
});


process.on('unhandledRejection', err =>{
    console.log("here");
    console.log(err.name, err.message);
    // console.log(err);
    console.log('Unhandled rejection💥 Shutting down...');
    server.close(()=>{ 
        process.exit(1);
    })
});


// console.log(x);