// exports.validateNationalIdDate = (national_id, date_birth) => {
//   // Handle Date objects or strings safely
//   let dateStr;

//   if (date_birth instanceof Date) {
//     // Convert Date → "YYYY-MM-DD"
//     dateStr = date_birth.toISOString().split('T')[0];
//   } else {
//     dateStr = String(date_birth);
//   }

//   let yearFull, month, day;

//   // Detect form=>
//   if (dateStr.includes('-')) {
//     // format: YYYY-MM-DD
//     [yearFull, month, day] = dateStr.split('-');
//   } else if (dateStr.includes('/')) {
//     // format: DD/MM/YYYY
//     [day, month, yearFull] = dateStr.split('/');
//   } else {
//     console.log("❌ Unsupported date format:", dateStr);
//     return false;
//   }

//   const year = +yearFull.slice(2); // last two digits of year
//   const centuryPrefix = +yearFull.slice(0, 2); // 19 or 20

//   let centuryDigit = 0;
//   if (centuryPrefix === 19) centuryDigit = 2;
//   else if (centuryPrefix === 20) centuryDigit = 3;

//   const idCentury = +national_id.slice(0, 1);
//   const idYear = +national_id.slice(1, 3);
//   const idMonth = +national_id.slice(3, 5);
//   const idDay = +national_id.slice(5, 7);

//   const isValid =
//     centuryDigit === idCentury &&
//     year === idYear &&
//     +month === idMonth &&
//     +day === idDay;

//   if (isValid) {
//     console.log("✅ Confirmed: National ID matches birth date!");
//   } else {
//     console.log("❌ Not confirmed: National ID doesn't match birth date!");
//   }

//   return isValid;
// };


// check expiers sys
function checkExpiryNationalIdDate (expiryDate) {
  const now =  new Date();
  const currentYear = now.getFullYear();  
  const currentMonth = now.getMonth() ;
  let currentDay = now.getDate();



  const [userYear , userMonth] = expiryDate.split('-');
  const NormalizedDate = new Date(currentYear , currentMonth + 1) ; // convert it to one based
  const NormalizedUserDate = new Date(userYear , userMonth ) ;  

  // const days  = new Date(currentYear , currentMonth  ,  currentDay)
// console.log(new Date(currentYear , currentMonth  ,  currentDay + 10));
for(let i = 0 ; i < 10 ; i++){
  currentDay += 1
  console.log((new Date(currentYear , currentMonth  ,  currentDay)).toISOString().split("T")[0]);
  
}


// if(NormalizedUserDate > NormalizedDate){
//   console.log("national id is valid!"); 
// }else{
//   console.log("national id is not valid!");
  
// }



// console.log(currentYear , currentMonth , currentDay , NormalizedDate , "user" ,NormalizedUserDate );


}



checkExpiryNationalIdDate("2030-10");



// function compareExpiryDate(expiryDateStr) {
//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based

//   const [expiryYearStr, expiryMonthStr] = expiryDateStr.split("-");
//   const expiryYear = parseInt(expiryYearStr);
//   const expiryMonth = parseInt(expiryMonthStr);

//   // Compare expiry date with current date
//   if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
//     return "expired"; 
//   } else {
//     return "not_expired"; 
//   }
// }

// // Function to get a formatted deadline date
// function getBookingDeadline(days = 10) {
//   const deadline = new Date();
//   deadline.setDate(deadline.getDate() + days);

//   // Get the date in DD-MM-YYYY format
//   const day = String(deadline.getDate()).padStart(2, '0');
//   const month = String(deadline.getMonth() + 1).padStart(2, '0'); // months are 0-based
//   const year = deadline.getFullYear();

//   return `${day}-${month}-${year}`;
// }

// // Function to check National ID expiry and booking deadline
// function checkNationalIdStatus(expiryDateStr) {
//   const status = compareExpiryDate(expiryDateStr);

//   let bookingDeadline;
  
//   // If expired, get 10 days from today's date
//   if (status === "expired") {
//     bookingDeadline = getBookingDeadline(10);
//     return {
//       status: "expired",
//       message: "Your national ID is expired. You have 10 days to book renewal.",
//       penalty: true,
//       bookingDeadline
//     };
//   } else {
//     // If not expired, get 10 days from the expiry date
//     const [expiryYearStr, expiryMonthStr] = expiryDateStr.split("-");
//     const expiryYear = parseInt(expiryYearStr);
//     const expiryMonth = parseInt(expiryMonthStr);

//     const expiryDate = new Date(expiryYear, expiryMonth - 1, 1); // Month is 0-based
//     bookingDeadline = getBookingDeadline(10);
    
//     return {
//       status: "active",
//       message: "Your national ID is still valid. You can book renewal 10 days before expiry.",
//       penalty: false,
//       bookingDeadline
//     };
//   }
// }

// // Example usage:
// const expiryDateStr = "2025-10"; // Format: "YYYY-MM"
// const statusInfo = checkNationalIdStatus(expiryDateStr);
// console.log(statusInfo);

// function compareExpiryDate(expiryDateStr) {
//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const currentMonth = now.getMonth() + 1; 

//   const [expiryYearStr, expiryMonthStr] = expiryDateStr.split("-");
//   const expiryYear = parseInt(expiryYearStr);
//   const expiryMonth = parseInt(expiryMonthStr);

//   // Compare
//   if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
//     return "expired"; 
//   } else {
//     return "not_expired"; 
//   }
// }



// // fix this
// function getBookingDeadline(days = 10) {
//   const deadline = new Date();
//   deadline.setDate(deadline.getDate() + days);
//   return deadline.toISOString().split("T")[0]; 
// }

// function checkNationalIdStatus(expiryDateStr) {
//   const status = compareExpiryDate(expiryDateStr);
//   const bookingDeadline = getBookingDeadline(10);

//   if (status === "expired") {
//     return {
//       status: "expired",
//       message: "Your national ID is expired. You have 10 days to book renewal.",
//       penalty: true,
//       bookingDeadline
//     };
//   } else {
//     return {
//       status: "active",
//       message: "Your national ID is still valid. You can book renewal 10 days before expiry.",
//       penalty: false,
//       bookingDeadline
//     };
//   }
// }



// // console.log(checkNationalIdStatus("2025-09"));
