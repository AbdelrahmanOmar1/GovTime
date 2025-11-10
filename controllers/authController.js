require('dotenv').config();
const jwt =  require('jsonwebtoken');
const userSchema = require('../validators/userValidation');
const pool = require('../db');
const bcrypt = require('bcrypt');

// SIGN IN CONTROLLER
exports.singin =  async( req , res) =>{
    try{

        // validate user input
            const {error , value }  =  userSchema.validate(req.body , {abortEarly : false});
            if(error){
                return res.status(400).json({
                    status : 'fail',
                    message : error.details.map(detail => detail.message)
                }); 
            }
            
            // hash password
            const salt =  await bcrypt.genSalt(12);
            value.password = await bcrypt.hash(value.password , salt);
            
            // insert user into data base
            const {full_name , national_id ,phone , email  , place_birth , address , date_of_birth , national_id_expiry_date , password } = value;
            

            // check if national id equal to birth date
           
            
            const newUser = await pool.query('INSERT INTO Users(full_name , national_id ,phone , email  , place_birth , address , date_of_birth , national_id_expiry_date , password ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *' ,
            [full_name , national_id ,phone , email  , place_birth , address , date_of_birth , national_id_expiry_date , password ]);

            // CREATE TOKEN
                const token =  jwt.sign ({id: newUser.rows[0].id} , process.env.JWT_SECRET_KEY , {expiresIn : process.env.JWT_EXPIRES_IN});
                console.log(token);
        
            // SEND RESPONSE
            res.status(201).json({
                status : 'success',
                message: 'User signed in successfully',
                token
            });
}catch(err){    
    res.status(500).json({
        status : 'error',
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
            res.status(400).json({
                status : 'fail',
                message : 'Please provide national_id and password'
            }); 
        }

        // check if user exists
        const user =  await pool.query('SELECT * FROM Users WHERE national_id = $1' , [national_id]);
        if(user.rows.length === 0){
            return res.status(404).json({
                status : 'fail',
                message : 'User not found'
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


        // create token
        const token =  jwt.sign ({id : user.rows[0].id} , process.env.JWT_SECRET_KEY , {expiresIn : process.env.JWT_EXPIRES_IN});
        
        // send response 
        res.status(200).json({
            status : 'success',
            message : 'User logged in successfully',
            token,
        });

}catch(err){
    res.status(500).json({
        status : 'error',
        message : err.message
    });

}
}
// authenticate controller




// ristercted controller
