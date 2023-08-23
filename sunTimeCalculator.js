const { select, map, pick } = require("@laufire/utils/collection");
const { peek } = require("@laufire/utils/debug");
const {possibilities} = require("@laufire/utils/prob");
const dayjs = require("dayjs");
var timezone = require('dayjs/plugin/timezone')
const { find } = require('geo-tz')
const SunCalc =require("suncalc");
const firstTestData = require("./sunTimesFirstTestData");
const secondTestData = require("./sunTimesSecondTestData");

dayjs.extend(timezone);

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
    }
]
const dates =[
  "2/28/2023, 12:00:00",
  "5/01/2023, 12:00:00",
  "8/31/2023, 12:00:00",
  "11/15/2023, 12:00:00",
 
];



const dateTimeFormatter=(timeList)=>(
  map(timeList,(times)=>new Date(times).toLocaleString()));

const getCalculatedSunTimes=(data) => {
  const {latitude,longitude,date } = data;
  const UTCDate = dayjs(date,find(latitude,longitude));
  const sunTimes = SunCalc.getTimes(UTCDate, latitude, longitude, 0);
  const timeList = select(sunTimes,["sunrise","sunset"]);
 
  return ({
    ...data,
   sunrise:dayjs(timeList.sunrise,find(latitude,longitude)),
   sunset:dayjs(timeList.sunset,find(latitude,longitude))
  });
};

const getTableData = ({place,date,sunrise,sunset,id,data})=>
{
  const latitude = data[id].latitude;
  const longitude =  data[id].longitude;
  const sunriseTestData = dayjs((data[id]).sunrise,find(latitude,longitude));
  const sunsetTestData = dayjs((data[id]).sunset,find(latitude,longitude));
  const differenceInSunrise = `${sunrise.diff(sunriseTestData,'minutes')} minutes`;
  const differenceInSunset =`${sunset.diff(sunsetTestData,'minutes')} minutes`;
  return ({
  place,
  ...dateTimeFormatter(
    {
      date,
      sunrise,
      sunriseTestData,
      sunset,
      sunsetTestData
    }
    ),
  differenceInSunrise,
  differenceInSunset,   
  });
};

const tableDisplay = (calculatedData) => {
  console.table(calculatedData);
}
const main=()=> {
const comboArray = possibilities({locations,dates});
const correctedArray = comboArray.map((ele)=>(
  {
    ...ele.locations,
    date:ele.dates,
  }))
const extendedArray = correctedArray.map(getCalculatedSunTimes); 
const firstComparisonTable = extendedArray.map((details,id)=>getTableData({...details,id,data:firstTestData}));
const secondComparisonTable = extendedArray.map((details,id)=>getTableData({...details,id,data:secondTestData}))
console.log("FirstComparisonResultTable");
tableDisplay(firstComparisonTable);
console.log("SecondComparisonResultTable");
tableDisplay(secondComparisonTable);
// console.log(correctedArray);
}
main();
