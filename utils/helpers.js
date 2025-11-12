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



exports.checkNationalIdExpiry = (expiryDate )=> {
  const today = new Date().toISOString().split("T")[0];
  if (expiryDate < today) {
    console.log("❌ Your national ID has expired! Please renew it.");
    return false;
    // let date = new Date(); 
    // for (let i = 1; i <= 10; i++) {
    //   date.setDate(date.getDate() + 1); 
    //   console.log(date.toISOString().split("T")[0]);
    // }
  } else {
    console.log("✅ Your national ID is still valid!");
    return true;
  }
}











