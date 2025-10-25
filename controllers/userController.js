const pool =  require('../db');
const userSchema = require('../validators/userValidation');


exports.getAllUsers = async (req, res) => {
    try {
        const data = await pool.query ('SELECT * FROM Users;');
        res.status(200).json({
            status: 'success',
            results: data.rows.length,
            data: { users: data.rows}
        })
        }catch (err) {
            res.status(500).json({
                 status: 'error', 
                 message: err.message 
            
                });
        }
    }



exports.createUser = async(req ,res) => {
    try{
        // validate user input
        const {error , value}  = userSchema.validate(req.body , {abortEarly : false});
        if(error){
            return res.status(400).json({  
                status: 'fail',
                message: error.details.map(detail => detail.message)
            });
        }
        // insert new user into database
        
        const {full_name , national_id , phone ,  email , place_birth , address , date_of_birth , national_id_expiry_date , password }  = value;
        const newUser = await pool.query('Insert INTO Users (full_name , national_id , phone ,  email , place_birth , address , date_of_birth , national_id_expiry_date , password) VALUES ($1, $2, $3, $4, $5, $6, $7 , $8 , $9) RETURNING *' ,
        [full_name , national_id , phone ,  email , place_birth , address , date_of_birth , national_id_expiry_date , password]);
        res.status(201).json({
            status: 'success',
            data: { user: newUser.rows[0]}
        });
    }catch(err){
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}

exports.getUserById = async (req, res) => {
    try{
        const {id}  = req.params;
        const user  =  await pool.query('SELECT * FROM Users WHERE id = $1' , [id]);
        if(user.rows.length === 0){
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }   
        res.status(200).json({
            status: 'success',
            data: { user: user.rows[0]}
        });
    }catch(err){
        res.status(500).json({
            status: 'error',        
            message: err.message
        });
    }   
}

exports.updateUser = async (req, res) => {
    try{
        const {id} = req.params;    
        const {full_name , national_id , phone ,  email , Place_birth , address , date_of_birth}  = req.body;
        const updatedUser = await pool.query('UPDATE Users SET full_name = $1 , national_id = $2 , phone = $3 ,  email = $4 , Place_birth = $5 , address = $6 , date_of_birth = $7 WHERE id = $8 RETURNING *' ,
        [full_name , national_id , phone ,  email , Place_birth , address , date_of_birth, id]);        
        if(updatedUser.rows.length === 0){
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }       
        res.status(200).json({
            status: 'success',
            data: { user: updatedUser.rows[0]}
        });
    }catch(err){
        res.status(500).json({
            status: 'error',    
            message: err.message
        });
    }

}

 exports.deleteUser = async (req, res) => {
    try{
        const {id} = req.params;
        const deletedUser = await pool.query('DELETE FROM Users WHERE id = $1 RETURNING *' , [id]);
        if(deletedUser.rows.length === 0){      
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    }catch(err){
        res.status(500).json({
            status: 'error',    
            message: err.message
        });
    }      

}