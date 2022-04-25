import request, { download } from '@/utils/request'

/**
 * 获取客户及拜访统计数据
 * @param {*} params
 * @returns
 */
export function getCustomersList(params) {
  return request({
    url: `/system/statistics/queryCustomersStatistics`,
    method: 'post',
    data: params,
  })
}
/**
 * 查询公司所有 二级部门
 * @param {*} params
 * @returns
 */
export function getgetSecondarySector() {
  return request({
    url: `/system/statistics/getSecondarySector`,
    method: 'get',
  })
}

