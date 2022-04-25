import request, { download } from '@/utils/request'

/**
 * 获取报表列表
 */
export function getOrderlist(params) {
  return request({
    url: `/hterp/orderDetail/list`,
    method: 'get',
    params: params,
  })
}

/**
 * 下载报表
 */
export function exportOrderDetail(params) {
  return download(`/hterp/orderDetail/exportOrderDetail`, params, '订单发货收款明细表.xls')
}
