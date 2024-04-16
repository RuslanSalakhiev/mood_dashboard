import { filterInterval,getHeightForMobile } from "./utils.js"
import * as Plot from "npm:@observablehq/plot";

export function barEventsByMood(initData, {width} = {}, scale, interval,colorScale) {
  let data = filterInterval(initData, interval)

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


  
