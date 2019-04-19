import {md5} from './md5Util.js'

export function sign (LinkFit, timestamp, dataParams) {
  if (LinkFit.Userid > 0) {
    let strpara = dataParams
    let str = timestamp + LinkFit.Nonce + LinkFit.Userid + LinkFit.Token + strpara
    str.replace(' ', '')
    str = encodeURIComponent(str).toUpperCase()
    str = str.split('').sort().join('')
    return md5(str).toUpperCase()
  } else {
    return ''
  }
}
