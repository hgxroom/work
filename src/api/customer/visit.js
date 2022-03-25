import request, { download } from "@/utils/request";

/**
 * 获取拜访列表
 * @param {*} query
 * @returns
 */
export function getVisitList(query = {}) {
  return request({
    url: "system/customerVisit/list",
    method: "get",
    params: query,
  });
}

/**
 * 根据id查询拜访详情
 * @param {*} params
 * @returns
 */
export function getVisitById(params) {
  return request({
    url: `system/customerVisit/getById/${params}`,
    method: "get",
  });
}

/**
 * 新增拜访信息
 * @param {*} data
 * @returns
 */
export function createCustomerVisit(data) {
  return request({
    url: "system/customerVisit",
    method: "post",
    data,
  });
}

/**
 * 编辑拜访信息
 * @param {*} data
 * @returns
 */
export function editCustomerVisit(data) {
  return request({
    url: "system/customerVisit",
    method: "put",
    data,
  });
}

/**
 * 输入框模糊搜索客户名
 */
export function getCustomerInfoByName(name) {
  return request({
    url: `system/customerInfo/getCustomerInfoByName/${name}`,
    method: "get",
  });
}

/**
 * 访问列表导出
 * @returns
 */
export function visitExport() {
  // return request({
  //   url: `system/customerInfo/export`,
  //   method: "post",
  // });
  return download(`system/customerVisit/export`, {}, "拜访信息列表.xls");
}
