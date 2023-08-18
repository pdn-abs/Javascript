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
  "2/28/2023, 12:30:00",
  "5/01/2023, 12:00:00",
  "8/31/2023, 12:30:00",
  "11/15/2023, 12:30:00",
 
].map((date)=> new Date(date));



const dateTimeFormatter=(timeList)=>(
  map(timeList,(times)=>times.toLocaleString()));

const getCalculatedSunTimes=(data) => {
  const {latitude,longitude,date } = data;
  const sunTimes = SunCalc.getTimes(date, latitude, longitude, 0);
  const timeList = select(sunTimes,["sunrise","sunset"]);
 
  return ({
    ...data,
   sunrise:dayjs(timeList.sunrise,find(latitude,longitude)),
   sunset:dayjs(timeList.sunset,find(latitude,longitude))
  });
};

const getTableData = ({place,sunrise,sunset,id,data})=>
{
  const sunriseTestData = new Date((data[id]).sunrise);
  const sunsetTestData = new Date((data[id]).sunset);
  const differenceInSunrise = `${dayjs(sunrise).diff(dayjs(sunriseTestData),'minutes')} minutes`;
  const differenceInSunset =`${dayjs(sunset).diff(dayjs(sunsetTestData),'minutes')} minutes`;

  return ({
  place,
  ...dateTimeFormatter(
    {sunrise,
    sunriseTestData,
    sunset,
    sunsetTestData,}
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
// console.table(extendedArray);
}
main();
