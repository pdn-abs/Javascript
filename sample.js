const date = new Date("2/28/2023, 11:16:00 am");
const gmt = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
console.log(gmt.toString());