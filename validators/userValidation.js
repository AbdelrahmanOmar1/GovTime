const joi =  require('joi');

// user validation schema
const userSchema = joi.object({
    full_name : joi.string().min(3).max(50).required().messages({
        'string.min': 'Full name must be at least 3 characters long',
        'string.max': 'Full name must be at most 50 characters long',
        'string.required': 'Full name is required'
    })
    ,
    national_id : joi.string().length(14).required().messages({
        'string.length': 'National ID must be exactly 14 characters long',
        'string.required': 'National ID is required',
        'string .unique': 'National ID Found duplicate! , please use another one'
    }),
    phone : joi.string().length(11).pattern(/^[0-9]{10,15}$/).required().messages({
        'string.length': 'Phone number must be exactly 11 characters long',
        'string.pattern.base': 'Phone number must contain only digits', 
        'string.required': 'Phone number is required'
    }),
    address : joi.string().min(5).max(100).required().messages({
        'string.min': 'Address must be at least 5 characters long',
        'string.max': 'Address must be at most 100 characters long',
        'string.required': 'Address is required'
    }),
    date_of_birth : joi.date().required().messages({
        'date.base' : 'Birth date must be a valid date',
        'string.required': 'Birth date is required'
    }),
    email : joi.string().email().required().messages({
        'string.email' : 'Email must be a valid email',
        'string.required': 'Email is required'
    }),
    password : joi.string().min(4).required().messages({
        'string.min': 'Password must be at least 4 characters long',
        'string.required': 'Password is required'
    }),
    address : joi.string().min(5).max(100).required().messages({
        'string.min': 'Address must be at least 5 characters long',
        'string.max': 'Address must be at most 100 characters long',
        'string.required': 'Address is required'
    }),
    place_birth : joi.string().min(3).max(50).required().messages({
        'string.min': 'Place of birth must be at least 3 characters long',
        'string.max': 'Place of birth must be at most 50 characters long',
        'string.required': 'Place of birth is required'
    }),
    role : joi.string().valid('user' , 'admin' , 'officer').default('user').messages({
        'any.only' : 'Role must be either user , admin , or officer',
    })
});



// validate date in national id




module.exports = userSchema;

