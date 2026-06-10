<template>
  <div class="counter-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Vuex Counter 演示</span>
      </div>
      <div class="content">
        <!-- 显示当前计数值 -->
        <div class="count-display">
          <span class="label">当前计数：</span>
          <span class="value">{{ count }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="button-group">
          <el-button type="primary" @click="handleIncrement">+ 1</el-button>
          <el-button type="success" @click="handleIncrementByStep">+ 5</el-button>
          <el-button type="warning" @click="handleDecrement">- 1</el-button>
          <el-button type="danger" @click="handleDecrementByStep">- 5</el-button>
        </div>

        <!-- 步长输入 -->
        <div class="step-input">
          <el-input
            v-model.number="step"
            type="number"
            placeholder="自定义步长"
            style="width: 200px;"
          />
          <el-button type="info" @click="handleCustomIncrement">+ {{ step }}</el-button>
          <el-button type="info" @click="handleCustomDecrement">- {{ step }}</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'CounterDemo',
  data() {
    return {
      step: 10 // 自定义步长
    }
  },
  computed: {
    // 使用 mapGetters 获取 counter 的 count 值
    ...mapGetters(['count'])
  },
  methods: {
    // 使用 mapActions 映射 counter 模块的 actions
    ...mapActions('counter', ['increment', 'decrement']),

    /**
     * 增加1
     */
    handleIncrement() {
      this.increment(1)
    },

    /**
     * 增加5
     */
    handleIncrementByStep() {
      this.increment(5)
    },

    /**
     * 减少1
     */
    handleDecrement() {
      this.decrement(1)
    },

    /**
     * 减少5
     */
    handleDecrementByStep() {
      this.decrement(5)
    },

    /**
     * 按自定义步长增加
     */
    handleCustomIncrement() {
      this.increment(this.step || 1)
    },

    /**
     * 按自定义步长减少
     */
    handleCustomDecrement() {
      this.decrement(this.step || 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.counter-container {
  padding: 20px;

  .content {
    text-align: center;
    padding: 30px;
  }

  .count-display {
    margin-bottom: 30px;
    .label {
      font-size: 18px;
      color: #666;
    }
    .value {
      font-size: 48px;
      font-weight: bold;
      color: #20a0ff;
      margin-left: 10px;
    }
  }

  .button-group {
    margin-bottom: 20px;
    .el-button {
      margin: 0 10px;
      width: 100px;
    }
  }

  .step-input {
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>
