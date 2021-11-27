<template>
  <div class="home">
    <div class="button_container">
      <el-button type="primary" @click="$router.push('ShortestPath')">最短路径-Dijkstra</el-button>
      <el-button type="primary">213</el-button>
      <el-button type="primary">213</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "Home"
}
</script>

<style scoped lang="scss">

.home {
  height: 100%;
  .button_container {
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}

</style>