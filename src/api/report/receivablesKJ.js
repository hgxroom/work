import request, { download } from '@/utils/request'

/**
 * 获取报表列表
 */
export function getFinance(params) {
  return request({
    url: `hterp/finance/kj/list`,
    method: 'get',
    params: params,
  })
}

/**
 * 下载报表
 */
export function financeExport() {
  return download(`hterp/finance/kj/exportAccount`, {}, '应收账款账龄分析表.xls')
}
