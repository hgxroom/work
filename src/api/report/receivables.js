import request, { download } from '@/utils/request'

/**
 * 获取报表列表
 */
export function getFinance(params) {
  return request({
    url: `hterp/finance/list`,
    method: 'get',
    params: params,
  })
}

/**
 * 下载报表
 */
export function financeExport() {
  return download(`hterp/finance/exportAccount`, {}, '营收账款.xls')
}
