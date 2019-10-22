import {md5} from './md5Util.js'

export function sign (LinkFit, timestamp, dataParams) {
  if (LinkFit.userid) {
    let strpara = dataParams
    let str = timestamp + LinkFit.nonce + LinkFit.userid + LinkFit.token + strpara
    str = str.replace(/[ ]/g, '')
    str = encodeURIComponent(str).toUpperCase()
    str = str.replace(/[(]/g, '%28').replace(/[)]/g, '%29')
    str = str.replace(/[!]/g, '%21').replace(/[']/g, '%27').replace(/[*]/g, '%2A')
    console.log(str)
    str = str.split('').sort().join('')
    return md5(str).toUpperCase()
  } else {
    return ''
  }
}
