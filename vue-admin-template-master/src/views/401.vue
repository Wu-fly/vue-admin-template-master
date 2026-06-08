<template>
  <div class="wscn-http401-container">
    <div class="wscn-http401">
      <div class="pic-401">
        <div class="code">401</div>
      </div>
      <div class="bullshit">
        <div class="bullshit__oops">OOPS!</div>
        <div class="bullshit__headline">{{ message }}</div>
        <div class="bullshit__info">Sorry, you do not have permission to access this page.</div>
        <div class="bullshit__info">Please contact the administrator or return to the homepage.</div>
        <a href="" class="bullshit__return-home">Back to home</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page401',
  computed: {
    message() {
      return 'You do not have permission to access this page...'
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http401-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.wscn-http401 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
  text-align: center;

  .pic-401 {
    position: relative;
    margin: 0 auto;
    .code {
      font-size: 200px;
      font-weight: bold;
      color: #20a0ff;
      line-height: 1.2;
    }
  }
  .bullshit {
    margin-top: 20px;
    &__oops {
      font-size: 32px;
      font-weight: bold;
      color: #20a0ff;
      margin-bottom: 10px;
    }
    &__headline {
      font-size: 22px;
      color: #333;
      margin-bottom: 10px;
    }
    &__info {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    &__return-home {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background: #20a0ff;
      color: #fff;
      border-radius: 4px;
      text-decoration: none;
      &:hover {
        background: #1d8fe0;
      }
    }
  }
}
</style>
