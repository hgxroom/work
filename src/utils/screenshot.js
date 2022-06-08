import html2canvas from 'html2canvas'
/**
 * 屏幕截图并下载
 * @param {String} type 截图盒子类型 '0':id '1':class
 * @param {String} ClassName 截图盒子名称
 * @param {String} ImgName 截图名称
 * @param {String} clothNo 截图名称-布号
 * @returns {Boolean}
 */

// 截图
export function crossTabletoImage(type, ClassName, ImgName, clothNo) {
  const canvas = document.createElement('canvas')
  let canvasBox = null
  if (type === '0') {
    canvasBox = document.querySelector('#' + ClassName)
  } else {
    canvasBox = document.querySelector('.' + ClassName)
  }
  const width = canvasBox.clientWidth
  const height = canvasBox.offsetHeight
  // 宽高 * 2 并放大 2 倍 是为了防止图片模糊
  canvas.width = width * 2
  canvas.height = height * 2
  // canvas.width = width
  // canvas.height = height
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  const context = canvas.getContext('2d')
  context.scale(2, 2)
  // context.scale(1, 1)
  const options = {
    backgroundColor: '#F5F7FA',
    canvas: canvas,
    useCORS: true,
    height: document.getElementsByClassName('app-main').scrollHeight,
    windowHeight: document.getElementsByClassName('app-main').scrollHeight,
  }
  html2canvas(canvasBox, options).then((canvas) => {
    const dataURL = canvas.toDataURL('image/png') // 图片格式转成base64
    downloadImage(dataURL, ImgName, clothNo)
  })
}
// 下载图片
function downloadImage(url, ImgName, clothNo) {
  const a = document.createElement('a')
  a.href = url
  a.download = ImgName + '-' + clothNo
  a.click()
}
