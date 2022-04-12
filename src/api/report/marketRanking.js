import request, { download_JSON } from '@/utils/request'

/**
 * 获取报表列表
 */
export function getsaleMoneyBacklist(params) {
  return request({
    url: `/hterp/saleBackMoney/list`,
    method: 'post',
    data: params,
  })
}

/**
 * 下载报表
 */
export function exportexportMoneyBacklist(params) {
  return download_JSON(
    `/hterp/saleBackMoney/export`,
    JSON.stringify(params),
    '销售及汇款排名表.xls',
  )
}
