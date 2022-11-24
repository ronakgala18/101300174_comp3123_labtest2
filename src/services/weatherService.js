import {DateTime} from "luxon";
const API_KEY = "b2f9c10ee2ab6863b34a3b9e8c75c6bf"

const BASE_URL = "https://api.openweathermap.org/data/2.5"

const getWeatherData = (infoType ,searchParams) =>{
    const url = new URL(BASE_URL +"/"+ infoType)
    url.search = new URLSearchParams({...searchParams, appid:API_KEY})
    return fetch(url).then((res)=> res.json());
};
const formatCurrentWeather = (data) =>{
    const {
        coord: {lat,lon},
        main:{temp,feels_like,temp_min,temp_max,humidity},
        name,
        dt,
        sys:{country,sunrise,sunset},
        weather,
        wind:{speed}
    }=data;
    const {main:details,icon}=weather[0]
    return {lat,lon,temp,feels_like,temp_min,temp_max,humidity,name,dt,country,sunrise,sunset,details,icon,speed}

}
const formatForcatWeather =(data)=>{
    let {timzone,list}=data;
    list=list.slice(1,6).map(d=>{
        return {
            title: formatToLocalTime(d.dt,timzone,'ccc'),
            temp:d.temp.day,
            icon:d.weather[0].icon
        }
    });

    return{timzone,list};
}

const getFormattedWeatherData = async (searchParams)=>{
    const formattedCurrentWeather = await getWeatherData
    ('weather',searchParams).then(formatCurrentWeather)

    const {lat,lon}=formattedCurrentWeather
    const formattedForecastWeather = await getWeatherData("forecast/daily",
    {
        lat,
        lon,
        units:searchParams.units,
    }).then(formatForcatWeather)
    
    return {...formattedCurrentWeather, ...formattedForecastWeather};
};
const formatToLocalTime = (secs,zone,format="cccc,dd LLL yyyy'|Locat time: 'hh:mm a")=>
                            DateTime.fromSeconds(secs)
                            .setZone(zone)
                            .toFormat(format);

const iconUrlFromCode = (code)=>`http://openweathermap.org/img/wn/${code}@2x.png`

export default getFormattedWeatherData

export {formatToLocalTime, iconUrlFromCode}