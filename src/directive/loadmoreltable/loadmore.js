/**
 * v-loadmore 虚拟滚动
 * Copyright (c) 2022/4/6 zed
 */

export default {
  bind(el, binding) {
    let p = 0

    let t = 0

    let down = true

    let selectWrap = el.querySelector('.el-table__body-wrapper')

    selectWrap.addEventListener('scroll', function () {
      //判断是否向下滚动

      p = this.scrollTop // if ( t < p){down=true}else{down=false}

      if (t < p) {
        down = true
      } else {
        down = false
      }

      t = p //判断是否到底

      const sign = 0

      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight

      if (scrollDistance <= sign && down) {
        binding.value()
      }
    })
  },
}
