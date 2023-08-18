const sunCalc = require('suncalc');

const sunTime = sunCalc.getTimes(new Date("02/28/2023, 6:00:00 am"),51.502541599117016,-0.14834431689179772,0 );

console.log(sunTime);