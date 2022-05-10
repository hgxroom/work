import request, { download } from '@/utils/request'

// 退税系数维护

/**
 * 退税系数信息列表
 * @param {*} query
 * @returns
 */
export function getDrawbackList(query = {}) {
  return request({
    url: '/system/drawback/list',
    method: 'get',
    params: query,
  })
}
/**
 * 编辑、修改退税系数信息
 * @param {*} query
 * @returns
 */
export function editDrawback(data = {}) {
  return request({
    url: '/system/drawback',
    method: 'PUT',
    data: data,
  })
}
/**
 * 新增退税系数信息
 * @param {*} query
 * @returns
 */
export function addDrawback(data = {}) {
  return request({
    url: '/system/drawback',
    method: 'POST',
    data: data,
  })
}
/**
 * 删除退税系数信息
 * @param {*} query
 * @returns
 */
export function delDrawback(ids) {
  return request({
    url: `/system/drawback/${ids}`,
    method: 'DELETE',
  })
}

// 纱线价格维护

/**
 * 纱线价格信息列表
 * @param {*} query
 * @returns
 */
export function getPriceList(query = {}) {
  return request({
    url: '/system/yarnPrice/list',
    method: 'get',
    params: query,
  })
}
/**
 * 编辑、修改纱线价格信息
 * @param {*} query
 * @returns
 */
export function editPrice(data = {}) {
  return request({
    url: '/system/yarnPrice',
    method: 'PUT',
    data: data,
  })
}
/**
 * 新增纱线价格信息
 * @param {*} query
 * @returns
 */
export function addPrice(data = {}) {
  return request({
    url: '/system/yarnPrice',
    method: 'POST',
    data: data,
  })
}
/**
 * 删除纱线价格信息
 * @param {*} query
 * @returns
 */
export function delPrice(ids) {
  return request({
    url: `/system/yarnPrice/${ids}`,
    method: 'DELETE',
  })
}

/**
 * 导出纱线价格信息
 * @returns
 */
export function yarnPriceExport() {
  return download(`/system/yarnPrice/export`, {}, '纱线价格信息.xls')
}

// 特整工艺维护

/**
 * 特整工艺维护列表
 * @param {*} query
 * @returns
 */
export function getSpecialFinishingProcessList(query = {}) {
  return request({
    url: '/system/specialFinishingProcess/list',
    method: 'get',
    params: query,
  })
}
/**
 * 编辑、修改特整工艺维护信息
 * @param {*} query
 * @returns
 */
export function editSpecialFinishingProcess(data = {}) {
  return request({
    url: '/system/specialFinishingProcess',
    method: 'PUT',
    data: data,
  })
}
/**
 * 新增特整工艺维护信息
 * @param {*} query
 * @returns
 */
export function addSpecialFinishingProcess(data = {}) {
  return request({
    url: '/system/specialFinishingProcess',
    method: 'POST',
    data: data,
  })
}
/**
 * 删除特整工艺维护信息
 * @param {*} query
 * @returns
 */
export function delSpecialFinishingProcess(ids) {
  return request({
    url: `/system/specialFinishingProcess/${ids}`,
    method: 'DELETE',
  })
}

// 染费数据维护

/**
 * 染费数据维护列表
 * @param {*} query
 * @returns
 */
export function getDyeingFeeDataList(query = {}) {
  return request({
    url: '/system/dyeingFeeData/list',
    method: 'get',
    params: query,
  })
}
/**
 * 编辑、修改染费数据维护信息
 * @param {*} query
 * @returns
 */
export function editDyeingFeeData(data = {}) {
  return request({
    url: '/system/dyeingFeeData',
    method: 'PUT',
    data: data,
  })
}
/**
 * 新增染费数据维护信息
 * @param {*} query
 * @returns
 */
export function addDyeingFeeData(data = {}) {
  return request({
    url: '/system/dyeingFeeData',
    method: 'POST',
    data: data,
  })
}
/**
 * 删除染费数据维护信息
 * @param {*} query
 * @returns
 */
export function delDyeingFeeData(ids) {
  return request({
    url: `/system/dyeingFeeData/${ids}`,
    method: 'DELETE',
  })
}

// 功能性承诺维护
/**
 * 功能性承诺维护列表
 * @param {*} query
 * @returns
 */
export function getFunctionalCommitmentList(query = {}) {
  return request({
    url: '/system/functionalCommitment/list',
    method: 'get',
    params: query,
  })
}
/**
 * 编辑、修改功能性承诺维护信息
 * @param {*} query
 * @returns
 */
export function editFunctionalCommitment(data = {}) {
  return request({
    url: '/system/functionalCommitment',
    method: 'PUT',
    data: data,
  })
}
/**
 * 新增功能性承诺维护信息
 * @param {*} query
 * @returns
 */
export function addFunctionalCommitment(data = {}) {
  return request({
    url: '/system/functionalCommitment',
    method: 'POST',
    data: data,
  })
}
/**
 * 删除功能性承诺维护信息
 * @param {*} query
 * @returns
 */
export function delFunctionalCommitment(ids) {
  return request({
    url: `/system/functionalCommitment/${ids}`,
    method: 'DELETE',
  })
}

// 汇率维护
/**
 * 汇率维护列表
 * @param {*} query
 * @returns
 */
export function getExchangeRateList(query = {}) {
  return request({
    url: '/system/exchangeRate/list',
    method: 'get',
    params: query,
  })
}
/**
 * 编辑、修改汇率维护信息
 * @param {*} query
 * @returns
 */
export function editExchangeRate(data = {}) {
  return request({
    url: '/system/exchangeRate',
    method: 'PUT',
    data: data,
  })
}
/**
 * 新增汇率维护信息
 * @param {*} query
 * @returns
 */
export function addExchangeRate(data = {}) {
  return request({
    url: '/system/exchangeRate',
    method: 'POST',
    data: data,
  })
}
/**
 * 删除汇率维护信息
 * @param {*} query
 * @returns
 */
export function delExchangeRate(ids) {
  return request({
    url: `/system/exchangeRate/${ids}`,
    method: 'DELETE',
  })
}

// 重量阶梯系数
/**
 * 重量阶梯系数列表
 * @param {*} query
 * @returns
 */
export function getWeightStepList(query = {}) {
  return request({
    url: '/system/weightStep/list',
    method: 'get',
    params: query,
  })
}
/**
 * 编辑、修改重量阶梯系数信息
 * @param {*} query
 * @returns
 */
export function editWeightStep(data = {}) {
  return request({
    url: '/system/weightStep',
    method: 'PUT',
    data: data,
  })
}
/**
 * 新增重量阶梯系数信息
 * @param {*} query
 * @returns
 */
export function addWeightStep(data = {}) {
  return request({
    url: '/system/weightStep',
    method: 'POST',
    data: data,
  })
}
/**
 * 删除重量阶梯系数信息
 * @param {*} query
 * @returns
 */
export function delWeightStep(ids) {
  return request({
    url: `/system/weightStep/${ids}`,
    method: 'DELETE',
  })
}

// 染整损耗维护
/**
 * 染整损耗维护列表
 * @param {*} query
 * @returns
 */
export function getDyeingFinishingLossList(query = {}) {
  return request({
    url: '/system/dyeingFinishingLoss/list',
    method: 'get',
    params: query,
  })
}
/**
 * 编辑、修改染整损耗维护信息
 * @param {*} query
 * @returns
 */
export function editDyeingFinishingLoss(data = {}) {
  return request({
    url: '/system/dyeingFinishingLoss',
    method: 'PUT',
    data: data,
  })
}
/**
 * 新增染整损耗维护信息
 * @param {*} query
 * @returns
 */
export function addDyeingFinishingLoss(data = {}) {
  return request({
    url: '/system/dyeingFinishingLoss',
    method: 'POST',
    data: data,
  })
}
/**
 * 删除染整损耗维护信息
 * @param {*} query
 * @returns
 */
export function delDyeingFinishingLoss(ids) {
  return request({
    url: `/system/dyeingFinishingLoss/${ids}`,
    method: 'DELETE',
  })
}
