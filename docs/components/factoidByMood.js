import { filterInterval,formatPercent } from "./utils.js"
import _ from "npm:lodash";

function getMoodAggregate(initData, interval, mood) {
  const data = filterInterval(initData, interval);
  const aggData = _.groupBy(data, 'mood')
  const percent = aggData[mood].length / data.length;

  return formatPercent(percent)

}

function getMoodAggregatePoP(initData, interval, mood) {
  
  let shifDays = 0

  if (interval === 'last 7') {shifDays = 7}
  if (interval === 'last 30') {shifDays = 30}
  if (interval === 'last 90') {shifDays = 90}
  
  const data = filterInterval(initData, interval, shifDays);
  const aggData = _.groupBy(data, 'mood')
  const percent = aggData[mood].length / data.length;

  return percent

}

function popText(initData, interval, mood) {

  const popValue =  getMoodAggregatePoP(initData, interval, mood); 

  if (interval === 'all time') return ''
  if (interval === 'last 7') return `${formatPercent(popValue)} pW`
  if (interval === 'last 30') return `${formatPercent(popValue)} pM`
  if (interval === 'last 90') return `${formatPercent(popValue)} pQ`
  return ''

}


export function factoidByMood (data, timeInterval, mood ) {

      const color = {
            'Nervous': 'red',
            'Neutral': 'yellow',
            'Happy': 'blue'
      }

      const result = {
            currentValue: getMoodAggregate(data, timeInterval, mood),
            popValue: popText(data, timeInterval, mood),
            color:color[mood]
      }

      return result
}
