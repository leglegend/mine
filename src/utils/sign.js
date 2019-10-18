import {md5} from './md5Util.js'

export function sign (LinkFit, timestamp, dataParams) {
  if (LinkFit.userid) {
    let strpara = dataParams
    let str = timestamp + LinkFit.nonce + LinkFit.userid + LinkFit.token + strpara
    str = str.replace(/[ ]/g, '')
    str = encodeURIComponent(str).toUpperCase()
    str = str.replace('(', '%28').replace(')', '%29')
    str = str.replace('!', '%21').replace("'", '%27').replace('*', '%2A')
    str = str.split('').sort().join('')
    return md5(str).toUpperCase()
  } else {
    return ''
  }
}
