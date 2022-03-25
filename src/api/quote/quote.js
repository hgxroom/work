import request, { download } from '@/utils/request'

/**
 * 获取报价列表
 * @param {object} query 列表查询参数
 * @returns
 */
export function getQuoteList(query = {}) {
  return request({
    url: 'system/quotedPriceApply/list',
    method: 'get',
    params: query,
  })
}

/**
 * 获取单号详情
 * @param {any} id 单号
 * @returns
 */
export function getQuoteDetail(id) {
  return request({
    url: `system/quotedPriceApply/getByApplyNo/${id}`,
    method: 'get',
  })
}

/**
 * 获取单号日志
 * @param {any} id 单号
 * @returns
 */
export function getQuoteDetailLog(id) {
  return request({
    url: `system/quotedPriceApply/log/${id}`,
    method: 'get',
  })
}

/**
 * 获取站内信日志
 */
export function stationNotice() {
  return request({
    url: '/system/stationNotice/list',
    method: 'get',
  })
}
export function setReadByApplyNo(id) {
  return request({
    url: '/system/stationNotice/setReadByApplyNo',
    method: 'post',
    data: { applyNo: id },
  })
}

/**
 * 创建报价详情
 * @returns axios 实例
 */
export function createQuoteDetail(data) {
  return request({
    url: 'system/quotedPriceApply',
    method: 'post',
    data,
  })
}

/**
 * 修改报价详情
 * @returns
 */
export function editQuoteDetail(data) {
  return request({
    url: '/system/quotedPriceApply',
    method: 'put',
    data,
  })
}

/**
 * 提交报价
 * @returns
 */
export function submitQuoteDetail(data) {
  return request({
    url: '/system/quotedPriceApply/submit',
    method: 'post',
    data,
  })
}

/**
 * 重申报价
 * @returns
 */
export function reiterateQuote(data) {
  return request({
    url: 'system/quotedPriceApply/reiterate',
    method: 'post',
    data,
  })
}

/**
 * 完结报价
 * @param {string|number} id 单号id
 * @returns
 */
export function quoteOver(id) {
  const data = {
    id,
  }
  return request({
    url: `system/quotedPriceApply/finished`,
    method: 'post',
    data: data,
  })
}

/**
 * 开发-提交信息
 * @param {object} data
 * @returns
 */
export function devSubmitInfo(data) {
  return request({
    url: `/system/devInfo/apply`,
    method: 'post',
    data,
  })
}

/**
 * 开发-驳回信息
 * @param {object} data 提交信息
 * @returns
 */
export function devRejectionInfo(data) {
  return request({
    url: `/system/devInfo/apply`,
    method: 'post',
    data,
  })
}

/**
 * 报价-提交信息
 */
export function quoteSubmitInfo(data) {
  return request({
    url: `/system/quotedPriceInfo/submit`,
    method: 'post',
    data,
  })
}

/**
 * 报价-驳回信息
 */
export function quoteRejectionInfo(data) {
  return request({
    url: `/system/quotedPriceApply/reject`,
    method: 'post',
    data,
  })
}
