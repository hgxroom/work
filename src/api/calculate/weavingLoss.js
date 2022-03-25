import request, { download } from "@/utils/request";

/**
 * 获取报价列表
 * @param {object} query 列表查询参数
 * @returns
 */
export function findFabricInfo(num = "") {
  if (!num) {
    return;
  }
  return request({
    url: `/system/htErp/findFabricInfoByBh/${num}`,
    method: "get",
  });
}

export function findComponentLoss() {
  return request({
    url: `/system/htErp/findComponentLoss`,
    method: "post",
    data: {
      status: 0,
    },
  });
}
