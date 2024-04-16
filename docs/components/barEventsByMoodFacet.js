import { filterInterval,getHeightForMobile } from "./utils.js"
import * as Plot from "npm:@observablehq/plot";

export function barEventsByMoodFacet(initData, {width} = {}, scale, interval,colorScale) {
  let data = filterInterval(initData, interval)

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


  
