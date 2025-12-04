const app = require('./app'); 
const chalk = require("chalk")

// start the server
const PORT = process.env.PORT || 8000;
app.listen (PORT, () => {
    try{
        console.log(chalk.yellow(`🚀 Server is running on port ${PORT}...`))  ;
    }catch(err) {
        console.error('Error starting server:', err);
    }
});


