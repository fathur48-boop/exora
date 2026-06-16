export function formatCurrencyShort(n) {
  const num=parseFloat(n)||0
  if(num>=1_000_000_000)return 'Rp '+(num/1_000_000_000).toFixed(1)+'B'
  if(num>=1_000_000)    return 'Rp '+(num/1_000_000).toFixed(1)+'M'
  if(num>=1_000)        return 'Rp '+(num/1_000).toFixed(0)+'K'
  return 'Rp '+num.toLocaleString('id-ID')
}
export function objectToChartData(obj,labelMap) {
  return Object.entries(obj||{}).map(([key,value])=>({label:labelMap?.[key]??key,value:parseFloat(value)||0}))
}
export function calcGrowth(current,previous) {
  if(!previous||previous===0)return null
  const pct=((current-previous)/previous)*100
  return {pct:Math.abs(pct).toFixed(1),direction:pct>=0?'up':'down'}
}
