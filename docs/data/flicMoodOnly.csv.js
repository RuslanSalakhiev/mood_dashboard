import {csvFormat} from "d3-dsv";
import {csv} from "d3-fetch";

function addWeekDays(initData) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return initData.map((d) => {

    
    
    return {...d, weekday }
  })
}

async function load() {
  const downloads = await csv(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTWf2uEKTbuIZ2Ffe-GaFYIezVaqrCvZKN3C3X-Uf2Ze6-8EWeGZIkIBnEzuoT_njvK-Sc1R9r0nTEN/pub?gid=239952448&single=true&output=csv`, (d) => {
  if (d.type === 'mood') {

    const date =  new Date(d.date);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = days[date.getDay()]

    return {
        date,
        weekday,
        mood: d.mood,
        type: d.type,
        comment: d.comment,
        
    }

  } 
  })

  return downloads
}

process.stdout.write(csvFormat(await load()));