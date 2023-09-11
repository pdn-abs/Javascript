const {possibilities} = require("@laufire/utils/prob");

const locations =[
    {
  place: 'London',
  latitude: 51.502541599117016,
  longitude: -0.14834431689179772 
},
{
  place: 'Chennai',
  latitude: 13.069484391471253,
  longitude: 80.31012742581258
},
]
const dates =[
"2/28/2023, 12:00:00",
"5/01/2023, 12:00:00",
"8/31/2023, 12:00:00",
"11/15/2023, 12:00:00",

];

const comboArray = possibilities({locations,dates});
const correctedArray = comboArray.map((ele)=>(
  {
    ...ele.locations,
    date:ele.dates,
  }))
module.exports = correctedArray;