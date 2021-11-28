<template>
  <div class="home">
    <div class="button_container">
      <div class="button" @click="$router.replace('ShortestPath')">
        最短路径-Dijkstra
      </div>
      <div class="button" @click="$router.replace('MST')">
        最小生成树-Kruskal
      </div>
      <div class="button" @click="$router.replace('MaxMatch')">
        最大匹配-匈牙利算法
      </div>
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
  background-color: #f0f2f5;;
  .button_container {
    height: 100%;
    //margin: 0 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    .button {
      margin: 40px;
      background-color: white;
      height: 100px;
      width: 300px;
      cursor: pointer;
      box-shadow: 4px 4px 40px rgba(0,0,0,.2);
      border-color: rgba(0,0,0,.05);
      border-radius: 10px;
      font-size: 24px;
      text-align: center;
      line-height: 100px;
      transition: .3s;
      overflow: hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
      &:hover {
        transform: translateY(-10px);
      }
    }
  }
}

</style>