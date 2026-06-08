<template>
  <div class="hello-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Hello Intern Page</span>
      </div>
      <div class="content">
        <h2>Hello</h2>
        <p>只有admin角色才能访问此页面</p>
        <p>当前用户：{{ name }}</p>
        <p>当前角色：{{ roles }}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'InternHello',
  computed: {
    ...mapGetters(['name', 'roles'])
  }
}
</script>

<style lang="scss" scoped>
.hello-container {
  padding: 20px;
  .content {
    text-align: center;
    h2 {
      color: #20a0ff;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      color: #333;
      line-height: 1.8;
    }
  }
}
</style>
