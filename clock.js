
let imageTime = 0;
let worldPlace = '';
let countryShortName = '';
let suffix = "px";
let savedcities = [];
let wheatherAllWorld = 0;
let weatherAllWorldF = 0;
let offsetWorld = '';
let wheatherIconWorld = '';
let zoombool = false;
let maxlat = 0;
let minlon = 0;
let maxColumn = 0;
let maxRow = 0;
let day = '';
let curentDay = 0;
let image = document.querySelector(".world-map");
let images = document.querySelectorAll('.img');
let zoomedpic = document.querySelector('.zoomed');
let curentHour = 0;
let curentMin = 0;
let offsetHoursWorld = 0;
let guadalajaraHours = 0;
let curentHourWorld = 0;
let imageLat = 0;
let imageLon = 0;
let imageLatRound = 0;
let imageLonRound = 0;

function getLatLonZoom(e) {
  if(zoombool) {
  const {imageOffsetTop, imageOffsetLeft} = scroll();
  const { heightDevider, widthDevider } = getWidthHeight();
  let positionYZoom = e.pageY - imageOffsetTop;
  let positionXZoom = e.pageX - imageOffsetLeft;
  let imageLatZoom = (maxlat) - ((positionYZoom/heightDevider) * 0.18);
  let imageLonZoom = ((positionXZoom/widthDevider) * 0.36 - (-minlon));
  imageLat = imageLatZoom;
  imageLon = imageLonZoom;
  imageLatRound = imageLatZoom.toFixed(2);
  imageLonRound = imageLonZoom.toFixed(2);
  return {imageLat, imageLon, imageLatRound, imageLonRound}
  }
}

function getLatLon(e) {
    if(!zoombool) {
    const {imageOffsetTop, imageOffsetLeft} = scroll();
    const { heightDevider, widthDevider } = getWidthHeight();
    let positionY = e.pageY - imageOffsetTop;
    let positionX = e.pageX - imageOffsetLeft;
    imageLat = (50 - positionY/heightDevider) * 1.8;
    imageLon = (positionX/widthDevider - 50) * 3.6;
    imageLatRound = imageLat.toFixed(2);
    imageLonRound = imageLon.toFixed(2);
    return {imageLat, imageLon, imageLatRound, imageLonRound}
    }
  }

function displayLonLat(e) {
  if(!zoombool) {
    const { heightDevider, widthDevider } = getWidthHeight();
    const {imageLat, imageLon, imageLatRound, imageLonRound} = getLatLon(e);
    document.documentElement.style.setProperty("--pageX", e.pageX + suffix);
    document.documentElement.style.setProperty(`--pageY`, e.pageY + suffix);
    document.querySelector('.spanLat').innerHTML = imageLat.toFixed(2);
    document.querySelector('.spanLon').innerHTML = imageLon.toFixed(2);
  }
}

function displayZoomed(e) {
  if(zoombool) {
    const { heightDevider, widthDevider } = getWidthHeight();
    const {imageLat, imageLon, imageLatRound, imageLonRound} = getLatLonZoom(e);
    document.documentElement.style.setProperty("--pageX", e.pageX + suffix);
    document.documentElement.style.setProperty(`--pageY`, e.pageY + suffix);
    document.querySelector('.spanLat').innerHTML = imageLatRound;
    document.querySelector('.spanLon').innerHTML = imageLonRound;
  }
}
zoomedpic.addEventListener('click', displayZoomed);
zoomedpic.addEventListener('mousemove', displayZoomed);


function displayOn() {
  if (!window.matchMedia("(max-width: 1000px)").matches) {
    document.querySelector('.movingDiv').style.display = "block";
  }
}

function displayOff() {
  document.querySelector('.movingDiv').style.display = "none";
}

image.addEventListener("mousemove", displayLonLat);
image.addEventListener("click", displayLonLat);
image.addEventListener("mouseover", displayOn);
image.addEventListener("mouseout", displayOff);

function zoom (e) {
  if(e.ctrlKey || e.shiftKey) {
    getWidthHeight();
    zoomedpic.style.backgroundImage = `url(./images/img${e.target.id}.jpg)`;
    zoomedpic.style.display = "grid";
    maxRow = Math.floor(e.target.id/10);
    maxlat = (90 - (maxRow  * 18));
    maxColumn = (e.target.id%10);
    minlon = maxColumn * 36 - 180;
    zoombool = true;;
  }};
  images.forEach(option => option.addEventListener('click', zoom));

  function zoomout(e) {
    if(e.ctrlKey || e.shiftKey) {
      getWidthHeight();
      zoomedpic.style.display = "none";
      zoombool = false;
    }
  }
  zoomedpic.addEventListener("click", zoomout);

  function getWidthHeight() {
    let theCSSpropWidth = window.getComputedStyle(image,null).getPropertyValue("width");
    let imageWidth = parseInt(theCSSpropWidth);
    let varHeight = imageWidth/2;
    document.documentElement.style.setProperty("--height", varHeight + suffix);
    let theCSSpropHeight = window.getComputedStyle(image,null).getPropertyValue("height");
    let imageHeight = parseInt(theCSSpropHeight);
    let heightDevider = imageHeight/100;
    let widthDevider = imageWidth/100;
    return { heightDevider, widthDevider }
  }
  getWidthHeight();

  function scroll() {
    getWidthHeight();
    let imageOffsetTop = image.offsetTop;
    let imageOffsetLeft = image.offsetLeft;
    return {imageOffsetTop, imageOffsetLeft}
  }
  scroll();
  window.addEventListener("scroll", scroll);

function getAllData(e) {
  if(!e.ctrlKey) {
  getLatLon(e);
  getLatLonZoom(e);
fetch(` https://maps.googleapis.com/maps/api/geocode/json?latlng=${imageLat},${imageLon}&key=AIzaSyAhbhZNE6A-Zcg49SMCyO7r_lH4MCDylRc `)
.then(response => response.json())
.then(cityName => {
  worldPlace = cityName.results[0].address_components[1].short_name;
  document.querySelector(".cityCorner1000").innerHTML = `${worldPlace}`;
})
fetch(` https://maps.googleapis.com/maps/api/timezone/json?location=${imageLat},${imageLon}&timestamp=1331161200&key=AIzaSyANpHwd0ZvP_2qrvqEEp-5l6NS3LkwxSbY `)
.then(response => response.json())
.then(world => {
  offsetWorld = world.rawOffset;
})
fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${imageLat}&lon=${imageLon}&units=metric&APPID=261e313010ab3d43b1344ab9eba64cfa`)
.then(response => response.json())
.then(data => {
  wheatherAllWorld = data.main.temp ;
  weatherAllWorldF = (wheatherAllWorld * 1.8)+32;
  wheatherIconWorld = data.weather[0].icon;
})
.then(() => {
  const timeWorld = new Date().getHours()
  const dayNow = new Date().getDay()
  const offsetHours = (offsetWorld/3600);
  console.log("timeWorld",timeWorld , offsetHours, guadalajaraHours);
  if ((offsetHours + timeWorld + guadalajaraHours + 1) > 23) {
     curentDay = dayNow + 1
   } else if ((offsetHours + timeWorld + guadalajaraHours + 1) < 0) {
     curentDay = dayNow - 1
   } else {
      curentDay = dayNow
   }
   switch (curentDay) {
     case 0:
     day = "Sunday";
     break;
     case 1:
     day = "Monday";
     break;
     case 2:
     day = "Tuesday";
     break;
     case 3:
     day = "Wednesday";
     break;
     case 4:
     day = "Thursday";
     break;
     case 5:
     day = "Friday";
     break;
     case 6:
     day = "Saturday";
   }
 })
.then(() => {
  document.querySelector('.movingDivmax1000').style.display = "block";
  document.querySelector('.spanLat1000').innerHTML = imageLat.toFixed(2);
  document.querySelector('.spanLon1000').innerHTML = imageLon.toFixed(2);
  document.querySelector('.cornerTemp1000').innerHTML = Math.round(wheatherAllWorld) + "C";
  document.querySelector('.cornerTempF1000').innerHTML = Math.round(weatherAllWorldF) + "F";
  document.querySelector('.cornerDay1000').innerHTML = day;
const nowWorld = new Date();
const minsWorld = nowWorld.getMinutes();
curentMin = minsWorld;
const hourWorld = nowWorld.getHours();
offsetHoursWorld = (offsetWorld / 3600);
const d = new Date();
const guadalajaraOffsetHours = d.getTimezoneOffset();
guadalajaraHours = (guadalajaraOffsetHours / 60);
curentHourWorld = Math.floor(hourWorld + offsetHoursWorld + guadalajaraHours + 1);
if (curentHourWorld >= 24) {
   let nextDay = curentHourWorld - 24
   document.querySelector(".hoursWorld").innerHTML = `${nextDay}`;
   curentHour = nextDay;
}
else if (curentHourWorld < 0) {
  let previousDay = curentHourWorld + 24
  document.querySelector(".hoursWorld").innerHTML = `${previousDay}`;
  curentHour = previousDay;
}
 else {
   document.querySelector(".hoursWorld").innerHTML = `${curentHourWorld}`;
   curentHour = curentHourWorld;
 }
document.querySelector(".minutesWorld").innerHTML = `:${minsWorld}h`;
})
.then(() => {
fetch(` https://maps.googleapis.com/maps/api/geocode/json?latlng=${imageLat},${imageLon}&key=AIzaSyAhbhZNE6A-Zcg49SMCyO7r_lH4MCDylRc `)
.then(response => response.json())
.then(function(cityName , i) {
  if (cityName.results[0] == undefined || cityName.results[0].address_components[1] == undefined) {
    worldPlace = 'MISSING PLACE NAME';
    document.querySelector(".World-city").innerHTML = `${worldPlace}`;
    countryShortName = '';
    document.querySelector(".World-countrey").innerHTML = `${countryShortName}`;
    const placeNameLi = {  worldPlace,  countryShortName , wheatherAllWorld , weatherAllWorldF, day, curentHour , curentMin , imageLatRound , imageLonRound , wheatherIconWorld};
    savedcities.push(placeNameLi);
    console.log('savedcities',savedcities);
    const savedList = document.querySelector('.list');
    savedList.innerHTML = savedcities.sort((a,b) => a.curentHour - b.curentHour).map(city => {
      return `
      <li>
      <input type="checkbox" data-index=${i} id="item${i}"> <span> ${city.worldPlace} ${city.countryShortName} Lat:${city.imageLatRound} Lon:${city.imageLonRound}</span><img class="icon-AllWorld" src="./content/${city.wheatherIconWorld}.png" width="70px" height="70px"><br>
      <span>   ${Math.round(city.wheatherAllWorld)}C|   ${Math.round(city.weatherAllWorldF)}F  ${city.day} ${city.curentHour}:${city.curentMin}h</span>
      </li>
      `;
    }).join('');
  } else if (cityName.results[0].address_components[3] == undefined)  {
    worldPlace = cityName.results[0].address_components[1].short_name ;
    document.querySelector(".World-city").innerHTML = `${worldPlace}`;
    countryShortName = '';
    document.querySelector(".World-countrey").innerHTML = `${countryShortName}`;
    const placeNameLi = { worldPlace,  countryShortName , wheatherAllWorld , weatherAllWorldF , day , curentHour , curentMin ,  imageLatRound , imageLonRound , wheatherIconWorld};
    savedcities.push(placeNameLi);
    console.log('savedcities',savedcities);
    const savedList = document.querySelector('.list');
    savedList.innerHTML = savedcities.sort((a,b) => a.curentHour - b.curentHour).map((city, i) => {
      return `
      <li>
      <input type="checkbox" data-index=${i} id="item${i}"> <span> ${city.worldPlace} ${city.countryShortName} Lat:${city.imageLatRound} Lon:${city.imageLonRound}</span><img class="icon-AllWorld" src="./content/${city.wheatherIconWorld}.png" width="70px" height="70px"><br>
      <span>   ${Math.round(city.wheatherAllWorld)}C|   ${Math.round(city.weatherAllWorldF)}F  ${city.day} ${city.curentHour}:${city.curentMin}h</span>
      </li>
      `;
    }).join('');
  } else  {
    worldPlace = cityName.results[0].address_components[1].short_name;
    document.querySelector(".World-city").innerHTML = `${worldPlace}` ;
    countryShortName = cityName.results[0].address_components[3].short_name;
    document.querySelector(".World-countrey").innerHTML = `${countryShortName}`;
    const placeNameLi = { worldPlace,  countryShortName , wheatherAllWorld , weatherAllWorldF , day , curentHour , curentMin,  imageLatRound , imageLonRound , wheatherIconWorld};
    savedcities.push(placeNameLi);
    console.log('savedcities',savedcities);
    const savedList = document.querySelector('.list');
    savedList.innerHTML = savedcities.sort((a,b) => a.curentHour - b.curentHour).map(city => {
      return `
      <li>
      <input type="checkbox" data-index=${i} id="item${i}"> <span> ${city.worldPlace} ${city.countryShortName} Lat:${city.imageLatRound} Lon:${city.imageLonRound}</span><img class="icon-AllWorld" src="./content/${city.wheatherIconWorld}.png" width="70px" height="70px"><br>
      <span>   ${Math.round(city.wheatherAllWorld)}C|   ${Math.round(city.weatherAllWorldF)}F  ${city.day} ${city.curentHour}:${city.curentMin}h</span>
      </li>
      `;
    }).join('');
    console.log(savedList);
  }
})
});
}
}


image.addEventListener("click", getAllData);









  // function zoomedAddToList(e) {
  //   if (!e.ctrlKey && zoombool) {
  //     getWidthHeight();
  //     fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${imageLat}&lon=${imageLon}&units=metric&APPID=261e313010ab3d43b1344ab9eba64cfa`)
  //     .then(response => response.json())
  //     .then(data => {
  //       wheatherAllWorld = data.main.temp ;
  //       weatherAllWorldF = (wheatherAllWorld * 1.8)+32;
  //       wheatherIconWorld = data.weather[0].icon;
  //     })
  //     .then(() => getTimeWorld(e))
  //     .then(() => {
  //       fetch(` https://maps.googleapis.com/maps/api/geocode/json?latlng=${imageLat},${imageLon}&key=AIzaSyAhbhZNE6A-Zcg49SMCyO7r_lH4MCDylRc `)
  //       .then(response => response.json())
  //       .then(function(cityName , i) {
  //         if (cityName.results[0] == undefined || cityName.results[0].address_components[1] == undefined) {
  //           worldPlace = 'MISSING PLACE NAME';
  //           document.querySelector(".World-city").innerHTML = `${worldPlace}`;
  //           countryShortName = '';
  //           document.querySelector(".World-countrey").innerHTML = `${countryShortName}`;
  //           const placeNameLi = { worldPlace,  countryShortName , wheatherAllWorld , weatherAllWorldF, day, curentHour , curentMin , imageLatRound , imageLonRound , wheatherIconWorld};
  //           savedcities.push(placeNameLi);
  //           console.log('savedcities',savedcities);
  //           const savedList = document.querySelector('.list');
  //           savedList.innerHTML = savedcities.sort((a,b) => a.curentHour - b.curentHour).map(city => {
  //             return `
  //             <li>
  //             <input type="checkbox" data-index=${i} id="item${i}"> <span> ${city.worldPlace} ${city.countryShortName} Lat:${city.imageLatRound} Lon:${city.imageLonRound}</span><img class="icon-AllWorld" src="./content/${city.wheatherIconWorld}.png" width="70px" height="70px"><br>
  //             <span>   ${Math.round(city.wheatherAllWorld)}C|   ${Math.round(city.weatherAllWorldF)}F  ${city.day} ${city.curentHour}:${city.curentMin}h</span>
  //             </li>
  //             `;
  //           }).join('');
  //         } else if (cityName.results[0].address_components[3] == undefined)  {
  //           worldPlace = cityName.results[0].address_components[1].short_name ;
  //           document.querySelector(".World-city").innerHTML = `${worldPlace}`;
  //           countryShortName = '';
  //           document.querySelector(".World-countrey").innerHTML = `${countryShortName}`;
  //           const placeNameLi = { worldPlace,  countryShortName , wheatherAllWorld , weatherAllWorldF , day , curentHour , curentMin ,  imageLatRound , imageLonRound , wheatherIconWorld};
  //           savedcities.push(placeNameLi);
  //           console.log('savedcities',savedcities);
  //           const savedList = document.querySelector('.list');
  //           savedList.innerHTML = savedcities.sort((a,b) => a.curentHour - b.curentHour).map(city => {
  //             return `
  //             <li>
  //             <input type="checkbox" data-index=${i} id="item${i}"> <span> ${city.worldPlace} ${city.countryShortName} Lat:${city.imageLatRound} Lon:${city.imageLonRound}</span><img class="icon-AllWorld" src="./content/${city.wheatherIconWorld}.png" width="70px" height="70px"><br>
  //             <span>   ${Math.round(city.wheatherAllWorld)}C|   ${Math.round(city.weatherAllWorldF)}F  ${city.day} ${city.curentHour}:${city.curentMin}h</span>
  //             </li>
  //             `;
  //           }).join('');
  //         } else  {
  //           worldPlace = cityName.results[0].address_components[1].short_name;
  //           document.querySelector(".World-city").innerHTML = `${worldPlace}` ;
  //           countryShortName = cityName.results[0].address_components[3].short_name;
  //           document.querySelector(".World-countrey").innerHTML = `${countryShortName}`;
  //           const placeNameLi = { worldPlace,  countryShortName , wheatherAllWorld , weatherAllWorldF , day , curentHour , curentMin,  imageLatRound , imageLonRound , wheatherIconWorld};
  //           savedcities.push(placeNameLi);
  //           console.log('savedcities',savedcities);
  //           const savedList = document.querySelector('.list');
  //           savedList.innerHTML = savedcities.sort((a,b) => a.curentHour - b.curentHour).map(city => {
  //             return `
  //             <li>
  //             <input type="checkbox" data-index=${i} id="item${i}"> <span> ${city.worldPlace} ${city.countryShortName} Lat:${city.imageLatRound} Lon:${city.imageLonRound}</span><img class="icon-AllWorld" src="./content/${city.wheatherIconWorld}.png" width="70px" height="70px"><br>
  //             <span>   ${Math.round(city.wheatherAllWorld)}C|   ${Math.round(city.weatherAllWorldF)}F  ${city.day} ${city.curentHour}:${city.curentMin}h</span>
  //             </li>
  //             `;
  //           }).join('');
  //         }
  //       })
  //     });
  //   }
  // }
  // zoomedpic.addEventListener("click", zoomedAddToList);

  // function DisplayCurrentTime() {
  //         let date = new Date();
  //         let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  //         let am_pm = date.getHours() >= 12 ? "PM" : "AM";
  //         hours = hours < 10 ? "0" + hours : hours;
  //         let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  //         let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  //         time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
  //         let lblTime = document.getElementById("lblTime");
  //         lblTime.innerHTML = time;
  //     };


  // const secondHandWorld = document.querySelector('.second-handWorld');
  // const minsHandWorld = document.querySelector('.min-handWorld');
  // const hourHandWorld = document.querySelector('.hour-handWorld');
  // function setDateWorld() {
  //   const nowWorld = new Date();
  //   const secondsWorld = nowWorld.getSeconds();
  //   const secondsDegreesWorld = ((secondsWorld / 60) * 360) + 90;
  //   secondHandWorld.style.transform = `rotate(${secondsDegreesWorld}deg)`;
  //   const minsWorld = nowWorld.getMinutes();
  //   const minsDegreesWorld = ((minsWorld / 60) * 360) + ((secondsWorld / 60)*6) + 90;
  //   minsHandWorld.style.transform = `rotate(${minsDegreesWorld}deg)`;
  //   const hourWorld = nowWorld.getHours();
  //   const offsetHoursWorld = (offsetWorld / 3600);
  //   const guadalajaraOffsetHours = (offsetWorld / 3600);
  //   const hourDegreesWorld = (((hourWorld + offsetHoursWorld + guadalajaraOffsetHours) / 12) * 360) + ((minsWorld/60)*30) + 90;
  //   hourHandWorld.style.transform = `rotate(${hourDegreesWorld}deg)`;
