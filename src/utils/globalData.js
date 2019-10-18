let globalData = {
  version: '2.48'
}
export function setGlobalData(data) {
  globalData = data
}

export function getGlobalData() {
  return globalData
}

export function getPages() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 2]
  return currentPage
}
