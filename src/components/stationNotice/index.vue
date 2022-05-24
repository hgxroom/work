<template>
  <el-dropdown class="right-menu-item hover-effect">
    <div style="height: 100%">
      <el-badge :is-dot="showDot" class="remind-item">
        <i class="el-icon-chat-line-square" />
        <!-- <div>
          <image style="width: 16px; height: 16px" src="../../assets/images/profile.jpg">123</image>
        </div> -->
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
        console.log(list)
        // if (auth.hasRole('admin')) {
        //   this.list = list
        //   return
        // }
        // if (auth.hasRole('salesman')) {
        //   list = list.filter((info) => {
        //     return info.receiverDept === '0'
        //   })
        // } else if (auth.hasRole('dev')) {
        //   list = list.filter((info) => {
        //     return info.receiverDept === '1'
        //   })
        // } else if (auth.hasRole('quotedPrice')) {
        //   list = list.filter((info) => {
        //     return info.receiverDept === '2'
        //   })
        // }
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
</style>
