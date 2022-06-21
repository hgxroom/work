function adjustColumnWidth(table) {
  const colgroup = table.querySelector('colgroup')
  const colDefs = [...colgroup.querySelectorAll('col')]
  colDefs.forEach((col) => {
    const clsName = col.getAttribute('name')
    console.log('clsName', clsName)
    const cells = [
      ...table.querySelectorAll(`td.${clsName}`),
      ...table.querySelectorAll(`th.${clsName}`),
    ]
    // 忽略加了"leave-alone"类的列
    if (cells[0]?.classList?.contains?.('leave-alone')) {
      return
    }
    const widthList = cells.map((el) => {
      console.log(el.querySelector('.cell')?.scrollWidth, 'width')
      return el.querySelector('.cell')?.scrollWidth || 0
    })
    const max = Math.max(...widthList)
    console.log('max', max)
    const padding = 20
    table.querySelectorAll(`col[name=${clsName}]`).forEach((el) => {
      el.setAttribute('width', max)
    })
  })
}

export default {
  update() {},
  bind() {},
  inserted(el) {
    setTimeout(() => {
      adjustColumnWidth(el)
    }, 300)
  },
  componentUpdated(el) {
    el.classList.add('r-table')
    setTimeout(() => {
      adjustColumnWidth(el)
    }, 300)
  },
  unbind() {},
}
