<template>
  <el-dropdown class="right-menu-item hover-effect">
    <div style="height: 100%">
      <el-badge :is-dot="showDot" class="remind-item">
        <i class="el-icon-chat-line-square" />
      </el-badge>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(item, index) in list" :key="index" @click.native="test(item)">
        <span>{{ item.content }}</span>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { stationNotice, setReadByApplyNo } from '@/api/quote/quote'
import { mapGetters } from 'vuex'
import auth from '@/plugins/auth'
export default {
  name: 'stationNotice',
  props: {},
  data() {
    return {
      list: [],
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['roles']),
    showDot: function () {
      return this.list.length > 0
    },
  },
  watch: {},
  methods: {
    getList() {
      stationNotice().then((res) => {
        let list = res.rows
        list = list.filter((item) => {
          return item.status !== 1
        })
        if (auth.hasRole('admin')) {
          this.list = list
          return
        }
        if (auth.hasRole('salesman')) {
          list = list.filter((info) => {
            return info.receiverDept === '0'
          })
        } else if (auth.hasRole('dev')) {
          list = list.filter((info) => {
            return info.receiverDept === '1'
          })
        } else if (auth.hasRole('quotedPrice')) {
          list = list.filter((info) => {
            return info.receiverDept === '1'
          })
        } else if (auth.hasRole('saleLeader')) {
          list = list.filter((info) => {
            return info.receiverDept === '2'
          })
        }
        this.list = list
      })
    },
    test(item) {
      let { applyNo } = item
      setReadByApplyNo(applyNo).then((res) => {
        let url = '/finance/reportDetail'
        this.$router.push({
          path: url,
          query: { type: 'detail', quotedOrderNo: applyNo, date: new Date().getTime() },
        })
      })

      this.getList()
    },
  },
  created() {
    this.getList()
    this.timer = setInterval(() => {
      this.getList()
    }, 10000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  deactivated() {
    clearInterval(this.timer)
  },
}
</script>
<style lang="scss" scoped>
.remind-item {
  display: flex;
  top: 15px;
}
.el-dropdown-menu {
  overflow-y: scroll; // 添加滚动条
  max-height: 200px; // 最大高度
  overflow-x: hidden; // 隐藏x轴上的滚动条
}
::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(97, 184, 179, 0.1);
  background: rgba(212, 227, 252, 0.6);
}
::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(87, 175, 187, 0.1);
  border-radius: 10px;
  background: #fff;
}
</style>
