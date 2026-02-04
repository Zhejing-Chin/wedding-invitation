// scripts/generate.js
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 1. ADD YOUR GUEST NAMES HERE
const guestNames = [
  "The Miller Family",
  "Sarah and James",
  "Uncle Dave",
  "Grandma & Grandpa"
];

const domain = "http://localhost:3000/rsvp"; // Change to your real URL later

let csvContent = "Name,UUID,Link\n";
let sqlContent = "INSERT INTO rsvps (id) VALUES \n";

guestNames.forEach((name, index) => {
  const id = uuidv4();
  const link = `${domain}/${id}`;
  
  csvContent += `"${name}","${id}","${link}"\n`;
  sqlContent += `('${id}')${index === guestNames.length - 1 ? ';' : ','}\n`;
});

if (!fs.existsSync('./secrets')) fs.mkdirSync('./secrets');
fs.writeFileSync('./secrets/master_list.csv', csvContent);
fs.writeFileSync('./secrets/seed.sql', sqlContent);

console.log("✅ Files generated in /secrets. Keep the CSV safe and private!");