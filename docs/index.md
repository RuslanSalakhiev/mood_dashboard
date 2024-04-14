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

const timeIntervalInput = Inputs.radio(["last 7","last 30", "last 90", "all time"], { value:"last 90"});
const timeInterval = Generators.input(timeIntervalInput);


const colorScale = {scheme: "Observable10", domain: ["Happy",  "Neutral", "Nervous"], legend: true } 

```

```js
import _ from "npm:lodash";

function filterInterval(initData, interval) {
  if (interval === 'all time') return initData  

  let days = 7
  if (interval === 'last 7') {days = 7}
  if (interval === 'last 30') {days = 30}
  if (interval === 'last 90') {days = 90}
  
  const currentTime = new Date()
  currentTime.setHours(0, 0, 0, 0)
  const nDaysAgo = currentTime.getTime() - (days * 24 * 60 * 60 * 1000);
  const filteredData = initData.filter(item => item.date >= nDaysAgo);
  

  return filteredData
}

function eventsTimeline(initData, {width, height} = {}, scale, interval) {

  let data = filterInterval(initData, interval)
  
  return Plot.plot({
    color: {scheme: "YlGnBu"},
    x: {label: null},
    y: { type: "linear", label: null },
    width,
    height,
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
    height,
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
    height,
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

function shareTimeline(initData, {width, height} = {}, scale, interval) {
  const data = filterInterval(initData, interval)

  const color = Plot.scale({color:colorScale});

  return Plot.plot({
    color: {...color },
    y: {label: null},
    width,
    height,
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

function getMoodAggregate(initData, interval, mood) {
  const data = filterInterval(initData, interval);
  const aggData = _.groupBy(data, 'mood')
  const percent = aggData[mood].length / data.length;
  return Math.floor(percent * 100) + '%'

}

```
<style>
.secondRow {
  /* grid-template-columns: 1fr; */
  grid-template-rows: 320px;
}
</style>


<div>
${scaleInput}
${timeIntervalInput}

</div>
<div class="grid grid-cols-4">
   <a class="card" style="color: inherit;">
    <h2>Nervous</h2>
    <span class="big red">${getMoodAggregate(mood, timeInterval, 'Nervous')}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Happy</h2>
    <span class="big blue">${getMoodAggregate(mood, timeInterval, 'Happy')}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Neutral</h2>
    <span class="big yellow">${getMoodAggregate(mood, timeInterval, 'Neutral')}</span>
  </a>
</div>
<div class="gridStructure">
  <div class="grid">
    <div class="card">
      ${resize((width) => shareTimeline(mood, {width}, scale, timeInterval))}
    </div>
  </div>

  <div class="grid " style="grid-auto-rows: 240px;">
    <div class="card">
      ${resize((width, height) => eventsTimeline(mood, {width,height}, scale, timeInterval))}
    </div>
  </div>

  <div class="grid secondRow grid-cols-2" >
    <div class="card">
      ${resize((width, height) => otherTimeline(mood, {width,height}, scale, timeInterval))}
    </div>
    <div class="card">
      ${resize((width, height) => weekdaysComparison(mood, {width, height}, scale, timeInterval))}
    </div>
  </div>
</div>
