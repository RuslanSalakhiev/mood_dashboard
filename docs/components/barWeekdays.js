import { filterInterval,getHeightForMobile } from "./utils.js"
import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3"


export function barWeekdays(initData, {width} = {}, interval,colorScale) {
  let data = filterInterval(initData, interval)
  console.log(data)
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


  
