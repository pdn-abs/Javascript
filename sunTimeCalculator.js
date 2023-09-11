const { select } = require("@laufire/utils/collection");
const dayjs = require("dayjs");
var timezone = require('dayjs/plugin/timezone')
const { find: findTimezone } = require('geo-tz')
const SunCalc =require("suncalc");

dayjs.extend(timezone);

const getCalculatedSunTimes = (data) => {
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


const getDayOfTheWeek = (date,latitude,longitude) => {
const sunTimeData = getCalculatedSunTimes({date,latitude,longitude});
const dateTime = dayjs(sunTimeData.date);
const timezone = findTimezone(latitude,longitude);
const sunrise = sunTimeData.sunrise;

return dateTime.isAfter(sunrise) 
? dateTime.format("dddd")
: dateTime.add(1,'day').format("dddd");

}

const main = () =>{
  console.log(getDayOfTheWeek(dayjs(), 13.069484391471253,80.31012742581258));
}
main();

