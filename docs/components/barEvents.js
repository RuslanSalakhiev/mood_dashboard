import { filterInterval,getHeightForMobile } from "./utils.js"
import * as Plot from "npm:@observablehq/plot";

export function barEvents(initData, {width} = {}, scale, interval) {
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