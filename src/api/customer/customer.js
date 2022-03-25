import request, { download } from "@/utils/request";

/**
 * 获取客户列表
 * @param {*} query
 * @returns
 */
export function getCustomerList(query = {}) {
  return request({
    url: "system/customerInfo/list",
    method: "get",
    params: query,
  });
}

/**
 * 创建客户详情
 * @param {*} data
 * @returns
 */
export function createCustomer(data) {
  return request({
    url: "system/customerInfo/save",
    method: "post",
    data,
  });
}

/**
 * 编辑客户详情
 * @param {*} data
 * @returns
 */
export function editCustomer(data) {
  return request({
    url: "system/customerInfo/edit",
    method: "post",
    data,
  });
}

/**
 * 根据id查询客户详情
 * @param {*} params
 * @returns
 */
export function getCustomerById(params) {
  return request({
    url: `system/customerInfo/getCustomerInfoById/${params}`,
    method: "get",
  });
}

/**
 * 客户列表导出
 * @returns
 */
export function customerExport() {
  // return request({
  //   url: `system/customerInfo/export`,
  //   method: "post",
  // });
  return download(`system/customerInfo/export`, {}, "客户信息列表.xls");
}
