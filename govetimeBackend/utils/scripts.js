exports.checkNationalIdWithDate = (national_id , birth_date) =>{
const split_nationalId = String(national_id).slice(0, 7);
const split_date = birth_date.split("-");

let year = split_nationalId.slice(1, 3);
let month = split_nationalId.slice(3, 5);
let day = split_nationalId.slice(5, 7);

if (split_nationalId.startsWith("2")) {
  if (
    year === birth_date[0].slice(2, 4) &&
    month === birth_date[1] &&
    day === birth_date[2]
  ) {
    console.log("✅ Confirmed! from century 1900s");
  } else {
    console.log("❌ Mismatch for century 1900s");
  }
}

if (split_nationalId.startsWith("3")) {
  if (
    year === birth_date[0].slice(2, 4) &&
    month === birth_date[1] &&
    day === birth_date[2]
  ) {
    console.log("✅ Confirmed! from century 2000s");
  } else {
    console.log("❌ Mismatch for century 2000s");
  }
}
}



exports.checkNationalIdExpiry = (expiryDate)=> {
  const today = new Date().toISOString().split("T")[0];
  if (expiryDate < today) {
    console.log("❌ Your national ID has expired! Please renew it.");
    let date = new Date(); 
    for (let i = 1; i <= 10; i++) {
      date.setDate(date.getDate() + 1); 
      console.log(date.toISOString().split("T")[0]);
    }
  } else {
    console.log("✅ Your national ID is still valid!");
  }
}











