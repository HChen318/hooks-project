// 去除时分秒
export function dateFormat(time = new Date()) {
  let timeVal = new Date(time)
  timeVal.setHours(0)
  timeVal.setMinutes(0)
  timeVal.setSeconds(0)
  timeVal.setMilliseconds(0)
  return timeVal.getTime()
}