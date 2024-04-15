---
theme: dashboard
title: Mood Tracker
toc: false
---

# Mood tracker 

<!-- Load and transform the data -->

```js
const mood = FileAttachment("data/flicMoodOnly.csv").csv({typed: true});

const scaleInput = Inputs.radio(["day", "week", "month"], { value:"day"});
const scale = Generators.input(scaleInput);

const timeIntervalInput = Inputs.radio(["last 7","last 30", "last 90", "all time"], { value:"last 7"});
const timeInterval = Generators.input(timeIntervalInput);


const colorScale = {scheme: "Observable10", domain: ["Happy",  "Neutral", "Nervous"], legend: true } 

```

```js
import _ from "npm:lodash";

function popText(initData, interval, mood) {

  const popValue =  getMoodAggregatePoP(initData, interval, mood); 

  if (interval === 'all time') return ''
  if (interval === 'last 7') return `${formatPercent(popValue)} pW`
  if (interval === 'last 30') return `${formatPercent(popValue)} pM`
  if (interval === 'last 90') return `${formatPercent(popValue)} pQ`
  return ''

}

function getHeightForMobile (width) {
  return width <300 ? width / 1.6 : undefined
}


function filterInterval(initData, interval, shiftDays = 0) {
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

function eventsTimeline(initData, {width} = {}, scale, interval) {

  let data = filterInterval(initData, interval)
  
  return Plot.plot({
    color: {scheme: "YlGnBu"},
    x: {label: null},
    y: { type: "linear", label: null },
    width,
    height: getHeightForMobile(width),
    marks: [
      Plot.rectY(data, Plot.binX({ y: "count" }, { x: "date", tip: true, interval: scale })),
      Plot.ruleY([0])
    ]
})
}


function otherTimeline(initData, {width, height} = {}, scale, interval) {

  const data = filterInterval(initData, interval)

  const color = Plot.scale({color:colorScale});

  return Plot.plot({
    color: {...color},
    y: {label: null},
    x: {label: null},
    width,
    height: getHeightForMobile(width),
    marks: [
    Plot.frame({ strokeOpacity: 0.1 }),
    Plot.rectY(
      data,
      Plot.binX(
        { y: "count"},
        { fy: "mood", x: "date", y: "mood", fill: "mood", tip: true, interval: scale  }
      )
    ),
    Plot.ruleY([0]),
    Plot.axisFy({label: null, text: null, }),
  ]
})
}

function weekdaysComparison(initData, {width, height} = {}, scale, interval) {
  const data = filterInterval(initData, interval)

  const color = Plot.scale({color:colorScale});
  
  return Plot.plot({
    label:null,
    x: {label: null},
    fx: {label: null},
    y: { type: "linear", label: null, percent: true},
    width,
    height: getHeightForMobile(width),
    color: {...color },
    marks: [
    Plot.frame({ strokeOpacity: 0.1 }),
    Plot.barY(
      data,
      Plot.groupX(
        { y: "proportion"},
        { fx: "weekday", x: "type", fill: "mood", tip: true, offset: 'normalize', order: [ "Nervous","Neutral", "Happy"] },
      ),
      
    ),
    Plot.textY(
      data,
      Plot.map({ text: (data) => data.map(d3.format(".0%")) },
        Plot.stackY(
           {order: "x", offset: 'normalize', order: [ "Nervous","Neutral", "Happy"]},
            Plot.groupX(
              { y: "proportion", text:'proportion-facet'},
              { fx: "weekday", x: "type", z:"mood", lineAnchor: 'bottom' },
            )
          ),
       )
    ),

    Plot.ruleY([0])
  ]
    
})
}

function shareTimeline(initData, {width, } = {}, scale, interval) {
  const data = filterInterval(initData, interval)

  const color = Plot.scale({color:colorScale});

  return Plot.plot({
    color: {...color },
    y: {label: null},
    width,
    height: getHeightForMobile(width),
    marks: [
    Plot.frame({ strokeOpacity: 0.1 }),
    Plot.rectY(
      data,
      Plot.binX(
        { y: "count"},
        { x: "date", y: "mood", fill: "mood", tip: true, interval: scale, offset: 'normalize' ,order: [ "Nervous","Neutral", "Happy"] }
      )
    ),
    Plot.ruleY([0]),

  ]
})
}


function formatPercent(num) {
  return Math.floor(num * 100) + '%'
}

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

```
<style>
.factoidRow {
    max-width: 600px;
    grid-template-columns: repeat(3, 1fr);
}


</style>


<div>
${scaleInput}
${timeIntervalInput}

</div>
<!-- <div class="grid grid-cols-2"> -->
  <div class="grid grid-cols-4 factoidRow">
    <a class="card" style="color: inherit;">
      <h2>Nervous</h2>
      <span class="big red">${getMoodAggregate(mood, timeInterval, 'Nervous')}</span><br>
      <span class="small red">${popText(mood, timeInterval, 'Nervous')}</span> 
    </a>
    <a class="card" style="color: inherit;">
      <h2>Happy</h2>
      <span class="big blue">${getMoodAggregate(mood, timeInterval, 'Happy')}</span><br>
      <span class="small blue">${popText(mood, timeInterval, 'Happy')}</span> 
    </a>
    <a class="card" style="color: inherit;">
      <h2>Neutral</h2>
      <span class="big yellow">${getMoodAggregate(mood, timeInterval, 'Neutral')}</span><br>
      <span class="small yellow">${popText(mood, timeInterval, 'Neutral')}</span> 
    </a>
  </div>
<!-- </div> -->
<div>
  <div class="grid">
    <div class="card">
      ${resize((width) => shareTimeline(mood, {width}, scale, timeInterval))}
    </div>
  </div>

  <div class="grid" >
    <div class="card">
      ${resize((width) => eventsTimeline(mood, {width}, scale, timeInterval))}
    </div>
  </div>

  <div class="grid" >
    <div class="card">
      ${resize((width) => otherTimeline(mood, {width}, scale, timeInterval))}
    </div>
    <div class="card">
      ${resize((width) => weekdaysComparison(mood, {width}, scale, timeInterval))}
    </div>
  </div>
</div>
