exports.checkNationalIdWithDate = (national_id , birth_date) =>{
const split_nationalId = String(national_id).slice(0, 7);
const split_date = new Date(String(birth_date).split("-")).toISOString().split("T")[0].split('-');
let year = split_nationalId.slice(1, 3);
let month = split_nationalId.slice(3, 5);
let day = split_nationalId.slice(5, 7);


if (split_nationalId.startsWith("2")) {
  if (
    year === split_date[0].slice(2, 4) &&
    month === split_date[1] &&
    day === split_date[2]
  ) {
    console.log("✅ Confirmed! from century 1900s");
    return true;
  } else {
    console.log("❌ Mismatch for century 1900s");
    return false;
  }
}else if (split_nationalId.startsWith("3")) {
  if (
    year === split_date[0].slice(2, 4) &&
    month === split_date[1] &&
    day === split_date[2]
  ) {
    console.log("✅ Confirmed! from century 2000s");
    return true;
  } else {
    console.log("❌ Mismatch for century 2000s");
    return false;
  }
}
console.log("Un valid century!");
return false; // century not a valid century!
}



exports.checkNationalIdExpiry = (expiryDate)=> {
  const today = new Date().toISOString().split("T")[0];
  expiryDate = expiryDate.toISOString().split("T")[0]
  if (expiryDate < today) {
    console.log("❌ Your national ID has expired! Please renew it."); // for debug
    return false;
  } else {
    console.log("✅ Your national ID is still valid!");   // fro debug
    return true;
  }
}

exports.generateDatsForExpierd = async ()=> {
  let dates =[]
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30 );
  for(let day = startDate ; day<=endDate ; day.setDate(day.getDate() +1)){
    const formatted  = day.toISOString().split("T")[0]
    dates.push(formatted)    
    
  }
  
  return dates
}




exports.generateDatsValid = async(userExpiryDate) =>{
  let dates = [];
  const startDate = new Date();
  const endDate = new Date(userExpiryDate);
  for(let day = startDate;  day<=endDate ; day.setDate(day.getDate() +1)){
    const formatted = day.toISOString().split('T')[0];
    dates.push(formatted) 
  }
   return dates;
}





