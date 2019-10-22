export function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function formatDate (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const t1 = [year, month > 9 ? month : '0' + month, day > 9 ? day : '0' + day].map(formatNumber).join('-')

  return `${t1}`
}

export function formatDateTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()

  const t1 = [year, month > 9 ? month : '0' + month, day > 9 ? day : '0' + day].map(formatNumber).join('-')

  return `${t1} ${hour}:00`
}

export function formatStringDate (date) {
  let dates = date.split('-')
  let newDate = new Date()
  newDate.setFullYear(dates[0])
  newDate.setMonth(dates[1] * 1 - 1)
  newDate.setDate(dates[2])
  return newDate
}

export function formatDateTitle (date) {
  const month = date.getMonth() + 1
  const day = date.getDate()

  const t1 = [month > 9 ? month : '0' + month, day > 9 ? day : '0' + day].map(formatNumber).join('-')

  return `${t1}`
}

export function formatWeek (date) {
  const day = date.getDay()
  switch (day) {
    case 0:
      return '周日'
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
  }
}

export function copy (obj) {
  var newobj = {}
  for (var attr in obj) {
    newobj[attr] = obj[attr]
  }
  return newobj
}

export default {
  formatNumber,
  formatDate,
  formatStringDate,
  formatDateTime,
  formatWeek,
  formatDateTitle,
  formatTime,
  copy
}
