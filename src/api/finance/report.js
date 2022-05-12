import request, { download } from '@/utils/request'
/**
 * 新增报价单
 * @param {*}
 * @returns
 */
export function buildProduct(data) {
  return request({
    url: '/system/buildProduct',
    method: 'POST',
    data: data,
  })
}
/**
 * 修改新布料（产品）信息状态
 * @param {*}
 * @returns
 */
export function editStatus(query) {
  return request({
    url: '/system/buildProduct/editStatus',
    method: 'POST',
    params: query,
  })
}
/**
 * 查询新布料（产品）信息列表（分页）
 * @param {*}
 * @returns
 */
export function getProductList(query) {
  return request({
    url: '/system/buildProduct/list',
    method: 'GET',
    params: query,
  })
}
/**
 * 模糊查询字典
 * @param {*}
 * @returns
 */
export function getDictList(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'GET',
    params: query,
  })
}
/**
 * 查询参考布料信息列表
 * @param {*}
 * @returns
 */
export function getFabricQuotationByBh(query) {
  return request({
    url: `/system/buildProduct/getFabricQuotationByBh`,
    method: 'GET',
    params: query,
  })
}

export function getTableDataInfoToAble() {
  return request({
    url: `/system/specialFinishingProcess/getTableDataInfoToAble`,
    method: 'GET',
  })
}

/**
 * 查询参考布料信息列表
 * @param {*}
 * @returns
 */
export function getFunctionalCommitmentByName() {
  return request({
    url: `/system/functionalCommitment/getFunctionalCommitmentByName`,
    method: 'GET',
  })
}
/**
 * 模糊查询纱支信息（翰通）列表
 * @param {*}
 * @returns
 */
export function getRawYarnInfoList(data) {
  return request({
    url: `/system/buildProduct/getRawYarnInfoList`,
    method: 'GET',
    params: data,
  })
}
/**
 * 获取成分列表
 * @param {*}
 * @returns
 */
export function findComponentLoss() {
  return request({
    url: `/system/dyeingFinishingLoss/getDyeingFinishingLossDtoToAble`,
    method: 'get',
  })
}
/**
 * 通过id查询新布料（产品）信息
 * @param {*}
 * @returns
 */
export function getBuildProductById(data) {
  return request({
    url: `/system/buildProduct/getBuildProductById`,
    method: 'get',
    params: data,
  })
}
