<template>
  <div class="header">
    <div class="back" @click="$router.push('/')">
      <i class="el-icon-arrow-left"></i>返回
    </div>
    <div class="title">
      <h2>{{ title }}</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    title: String
  }
}
</script>

<style scoped lang="scss">
.header {
  line-height: 60px;
  position: relative;

  .back {
    position: absolute;
    left: 20px;
    line-height: 60px;
    font-size: 18px;
  }

  .title {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    font-size: 18px;
  }
}
</style>