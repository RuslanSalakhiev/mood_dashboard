import _ from "npm:lodash";


export function getHeightForMobile (width) {
  return width <300 ? width / 1.6 : undefined
}


export function filterInterval(initData, interval, shiftDays = 0) {
  if (interval === 'all time') return initData  

  let days = 7
  if (interval === 'last 7') {days = 7}
  if (interval === 'last 30') {days = 30}
  if (interval === 'last 90') {days = 90}
  
  const currentTime = new Date() 
  currentTime.setHours(0, 0, 0, 0)

  const currentTimeWithshift = currentTime.getTime() - shiftDays * 24 * 60 * 60 * 1000
  const nDaysAgo = currentTimeWithshift - (days * 24 * 60 * 60 * 1000);

  const filteredData = initData.filter(item => item.date >= nDaysAgo && item.date <= currentTimeWithshift);
  

  return filteredData
}

export function formatPercent(num) {
  return Math.floor(num * 100) + '%'
}