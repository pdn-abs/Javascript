const dayjs = require("dayjs");
var timezone = require('dayjs/plugin/timezone')
const { find: findTimezone } = require('geo-tz')
const SunCalc =require("suncalc");
const inputData = require("./inputData");
const firstTestData = require("./sunTimesFirstTestData");
const secondTestData = require("./sunTimesSecondTestData");
const { select, map } = require("@laufire/utils/collection");

dayjs.extend(timezone);
  const getCalculatedSunTimes=(data) => {
    const {latitude,longitude,date } = data;
    const UTCDate = dayjs(date,findTimezone(latitude,longitude));
    const sunTimes = SunCalc.getTimes(UTCDate, latitude, longitude, 0);
    const timeList = select(sunTimes,["sunrise","sunset"]);
  
    return ({
      ...data,
     sunrise:dayjs(timeList.sunrise,findTimezone(latitude,longitude)),
     sunset:dayjs(timeList.sunset,findTimezone(latitude,longitude))
    });
  };

  const dateTimeFormatter=(timeList)=>(
    map(timeList,(times)=>new Date(times).toLocaleString()));
  const getTableData = ({place,date,sunrise,sunset,id,data})=>
  {
   const latitude = data[id].latitude;
   const longitude =  data[id].longitude;
   const sunriseTestData = dayjs((data[id]).sunrise,findTimezone(latitude,longitude));
   const sunsetTestData = dayjs((data[id]).sunset,findTimezone(latitude,longitude));
   const differenceInSunrise = `${sunrise.diff(sunriseTestData,'seconds')} seconds`;
   const differenceInSunset =`${sunset.diff(sunsetTestData,'seconds')} seconds`;
   return ({
   place,
   ...dateTimeFormatter(
    {
      // date,
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
  const extendedData = inputData.map(getCalculatedSunTimes); 
  const firstComparisonTable = extendedData.map((details,id)=>getTableData({...details,id,data:firstTestData}));
  const secondComparisonTable = extendedData.map((details,id)=>getTableData({...details,id,data:secondTestData}))
  console.log("FirstComparisonResultTable");
  tableDisplay(firstComparisonTable);
  console.log("SecondComparisonResultTable");
  tableDisplay(secondComparisonTable);
  // console.log(correctedArray);
  }
  main();