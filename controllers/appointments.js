const pool = require('../config/db');
const helpers = require('../utils/helpers');
const AppError = require('../utils/AppError');
require("dotenv").config()


//helper to check avaliable dates 
async function checkAvaliabledates (datsGenerated){
const availableDays = []
for(const dats of datsGenerated ){
    const countRes = await pool.query("SELECT COUNT(*) FROM appointments WHERE appointment_date = $1" ,[dats]);
    const hasvalues = parseInt(countRes.rows[0].count , 10);
    if(hasvalues < 400){
        if(process.env.NODE_ENV === "developmet"){
        availableDays.push({
            dats ,
            slots_left : 400 - hasvalues
        })
        }else{
            availableDays.push(dats)
        }

    }
}
return availableDays;
}


exports.getAvaliableAppointment =async(req,res,next) => {
    try{
        // CHECK FOR NATIONAL ID EXPIRY
        const userID = req.user.id;
        const userRES = await pool.query('SELECT nationalid_expiry_date FROM Users WHERE id = $1' ,[userID]);
        const userNationalId_expiry = userRES.rows[0].nationalid_expiry_date;

        
        // check if national id is expierd 
        const isValid = helpers.checkNationalIdExpiry(userNationalId_expiry);
        // generate dates
        const datsGenerated = await helpers.generateDatsForExpierd();
        const avaliableDays = await checkAvaliabledates(datsGenerated)
        // handel expired 
        if(!isValid){
            if(avaliableDays.length === 0){
                return res.status(200).json({
                    message :'Your national ID has been expierd! , please renew it now , "You will pay a fine"',
                    dats : ["no avaliable dates , plese book in VIP services!"]
                });
            }else{
            return res.status(200).json({
                   message :'Your national ID has been expierd! , please renew it now , "You will pay a fine"',
                   dats : avaliableDays
            })
            }

            // handel valid
        }if(isValid){
             if(avaliableDays.length === 0){
                return res.status(200).json({
                    message :'Your national ID is valid!',
                    dats : ["no avaliable dates , if you need you can book with VIP services!"]
                });
            }else{
            return res.status(200).json({
                   message :'Your national ID is valid!',
                   dats : avaliableDays
            })
            }
        }
    }catch(err){
        next (new AppError(err.message ,500))
    }
}


exports.bookAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: 'Please provide date and time.' });
    }

    // Check if this user already has a booked appointment
    const existing = await pool.query(
      'SELECT * FROM appointments WHERE user_id = $1 AND status = $2',
      [userId, 'booked']
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: 'You already have a booked appointment. Cancel it before booking a new one.'
      });
    }

    // Check if day is full
    const countRes = await pool.query(
      'SELECT COUNT(*) FROM appointments WHERE appointment_date = $1',
      [date]
    );
    const count = parseInt(countRes.rows[0].count, 10);

    if (count >= 400) {
      return res.status(400).json({
        message: 'This date is fully booked. Please choose another date.'
      });
    }

    // Save appointment
    await pool.query(
      'INSERT INTO appointments (user_id, appointment_date, appointment_time, status) VALUES ($1, $2, $3, $4)',
      [userId, date, time, 'booked']
    );

    res.status(201).json({
      status: 'success',
      message: `✅ Appointment booked successfully for ${date} at ${time}`
    });

  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { rowCount } = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 AND user_id = $3',
      ['cancelled', id, userId]
    );

    if (rowCount === 0)
      return next(new AppError('No appointment found or not owned by you', 404));

    res.status(200).json({
      status: 'success',
      message: 'Appointment cancelled successfully.'
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};
