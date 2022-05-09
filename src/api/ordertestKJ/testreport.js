import request, { download_JSON } from '@/utils/request'

/**
 * 获取报表列表
 */
export function getExternalOrderList(params) {
  // let data = JSON.stringify(params) //转化JSON格式
  return request({
    url: `hterp/external/getExternalOrderList2`,
    method: 'post',
    data: params,
  })
}

/**
 * 下载报表
 */
export function externalExport(params) {
  return download_JSON(`hterp/external/exportOrderList`, params, '内部测试报表-科技.xls')
}
