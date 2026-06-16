export function calcKpi(current,previous) {
  if(previous===0||!previous)return {pct:null,direction:'neutral'}
  const pct=((current-previous)/previous)*100
  return {pct:Math.abs(pct).toFixed(1),direction:pct>0?'up':pct<0?'down':'neutral'}
}
export function getLastTwoMonths(monthlyTrend) {
  if(!monthlyTrend||monthlyTrend.length<2)return {current:null,previous:null}
  return {current:monthlyTrend[monthlyTrend.length-1],previous:monthlyTrend[monthlyTrend.length-2]}
}
