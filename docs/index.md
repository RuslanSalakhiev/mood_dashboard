---
theme: dashboard
title: moodData Tracker
toc: false
---

# moodData tracker 

<!-- Load and transform the data -->

```js
const moodData = FileAttachment("data/flicMoodOnly.csv").csv({typed: true});

const scaleInput = Inputs.radio(["day", "week", "month"], { value:"day"});
const scale = Generators.input(scaleInput);

const timeIntervalInput = Inputs.radio(["last 7","last 30", "last 90", "all time"], { value:"last 7"});
const timeInterval = Generators.input(timeIntervalInput);


const colorScale = {scheme: "Observable10", domain: ["Happy",  "Neutral", "Nervous"], legend: true } 

import {barEventsByMood} from "./components/barEventsByMood.js";
import {barWeekdays} from "./components/barWeekdays.js";
import {barEvents} from "./components/barEvents.js";
import {barEventsByMoodFacet} from "./components/barEventsByMoodFacet.js";
import {factoidByMood} from "./components/factoidByMood.js";



```

```js

// Factoids

const nervousFactoid = factoidByMood(moodData, timeInterval, 'Nervous')
const neutralFactoid = factoidByMood(moodData, timeInterval, 'Neutral')
const happyFactoid = factoidByMood(moodData, timeInterval, 'Happy')



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
<div class="grid grid-cols-4 factoidRow">
    <a class="card" style="color: inherit;">
      <h2>Nervous</h2>
      <span class='big red'>${nervousFactoid.currentValue}</span><br>
      <span class="small red">${nervousFactoid.popValue}</span> 
    </a>
    <a class="card" style="color: inherit;">
      <h2>Happy</h2>
      <span class='big blue'>${happyFactoid.currentValue}</span><br>
      <span class="small blue">${happyFactoid.popValue}</span> 
    </a>
    <a class="card" style="color: inherit;">
      <h2>Neutral</h2>
      <span class='big yellow'>${neutralFactoid.currentValue}</span><br>
      <span class="small yellow">${neutralFactoid.popValue}</span> 
    </a>
</div>
<div>
  <div class="grid">
    <div class="card">
      ${resize((width) => barEventsByMood(moodData, {width}, scale, timeInterval, colorScale))}
    </div>
  </div>

  <div class="grid" >
    <div class="card">
      ${resize((width) => barEvents(moodData, {width}, scale, timeInterval))}
    </div>
  </div>

  <div class="grid" >
    <div class="card">
      ${resize((width) => barEventsByMoodFacet(moodData, {width}, scale, timeInterval, colorScale))}
    </div>
    <div class="card">
      ${resize((width) => barWeekdays(moodData, {width}, timeInterval, colorScale))}
    </div>
  </div>
</div>
