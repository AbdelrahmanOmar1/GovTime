const app = require('./app'); 

// start the server
const PORT = process.env.PORT || 8000;
app.listen (PORT, () => {
    try{
        console.log(`Server is running on port ${PORT}`);
    }catch(err) {
        console.log('Error starting the server:', err);
    }
});


