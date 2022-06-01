import request, { download } from '@/utils/request'
/**
 * 拜访计划信息列表（分页）
 */
export function getCustomerVisitPlan(params) {
  return request({
    url: `/system/customerVisitPlan/list`,
    method: 'get',
    params: params,
  })
}
/**
 * 拜访计划信息列表（分页）
 */
export function getcustomerVisitPlan(params) {
  return request({
    url: `/system/customerVisitPlan/save`,
    method: 'POST',
    data: params,
  })
}
/**
 * 根据主键id查询详情信息
 */
export function getcustomerVisitPlanDetailsById(id) {
  return request({
    url: `/system/customerVisitPlan/getById/${id}`,
    method: 'get',
  })
}
/**
 * 编辑拜访计划信息
 */
export function editCustomerVisitPlan(data) {
  return request({
    url: `/system/customerVisitPlan/edit`,
    method: 'put',
    data: JSON.stringify(data),
  })
}
/**
 * 获取部门信息
 */
export function getPlanVisitDeptList() {
  return request({
    url: `/system/customerVisitPlan/deptList`,
    method: 'get',
  })
}
/**
 * 获取状态数量
 */
export function getStateList(params) {
  return request({
    url: `/system/customerVisitPlan/stateList`,
    method: 'get',
    params: params,
  })
}
