require('dotenv').config();
const jwt =  require('jsonwebtoken');
const userSchema = require('../validators/userValidation');
const pool = require('../config/db');
const bcrypt = require('bcrypt');





// Generate token
const generateToken = (userId , userRole)=>{
    return jwt.sign({id : userId , role : userRole} , process.env.JWT_SECRET_KEY ,{
        expiresIn : process.env.JWT_EXPIRES_IN
    })
}

// SIGN IN CONTROLLER
exports.signin =  async( req , res) =>{
    try{

        // validate user input
            const {error , value }  =  userSchema.validate(req.body , {abortEarly : false});
           if (error) {
        const errors = error.details.map(d => d.message.replace(/['"]/g, ''));
        return res.status(400).json({
        status: 'fail',
        message: errors.details.map(detail => detail.message)
  });
} 
            
            // hash password
            const salt =  await bcrypt.genSalt(12);
            value.password = await bcrypt.hash(value.password , salt);
            
            // insert user into data base
            const {full_name , national_id ,phone , email  , place_birth , address , date_of_birth  , password } = value;
            

            // check if national id equal to birth date
           
            
            const newUser = await pool.query('INSERT INTO Users(full_name , national_id ,phone , email  , place_birth , address , date_of_birth  , password ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *' ,
            [full_name , national_id ,phone , email  , place_birth , address , date_of_birth  , password ]);

            // Generate TOKEN
                const token = generateToken(newUser.rows[0].id , newUser.rows[0].role);
        
            // SEND RESPONSE
            res.status(201).json({
                status : 'success',
                message: 'User signed in successfully',
                token
            });
}catch(err){    
    res.status(500).json({
        status : 'fail',
        message : err.message
    });
}
}


// LOGIN CONTROLLER
exports.login =  async (req ,res) => {
    try{
        // ccheck user input
        const {national_id , password}  = req.body;
        if(!national_id ||  !password){
            return res.status(400).json({
                status : 'fail',
                message : 'Please provide national_id and password'
            }); 
        }

        // check if user exists
        const user =  await pool.query('SELECT * FROM Users WHERE national_id = $1' , [national_id]);
        if(user.rows.length === 0){
            return res.status(404).json({
                status : 'fail',
                message : 'User not found , please signin!'
            });
        }

        // check if password is correct
        const validatePassword  = await bcrypt.compare(password , user.rows[0].password);
        if(!validatePassword){
            return res.status(401).json({
                status : 'fail',
                message : 'Incorrect password or national_id'
            });
        }


        // generate token
        const token = generateToken(user.rows[0].id , user.rows[0].role);
        // send response 
        res.status(200).json({
            status : 'success',
            message : 'User logged in successfully',
            token,
        });

}catch(err){
    res.status(500).json({
        status : 'fail',
        message : err.message
    });

}
}
// authenticate controller
exports.protect = async (req ,res , next)=>{
    try{
        let token;

        // check if token exist


        //  verify token


        // 3️⃣ Check if user still exists


        // 4️⃣ Attach user to request
    }catch(err){
        res.status(500).json({
            status : "fail",
            message : err.message

        })
    }
}



// ristercted controller
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You are not allowed to perform this operation!",
      });
    }
    next();
  };
};