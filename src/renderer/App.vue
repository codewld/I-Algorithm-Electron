<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'i-algorithm-electron'
  }
</script>

<style>
/*清除元素默认的内外边距  */
* {
  margin: 0;
  padding: 0;
}
/*让所有斜体 不倾斜*/
em,
i {
  font-style: normal;
}
/*去掉列表前面的小点*/
li {
  list-style: none;
}
/*图片没有边框   去掉图片底侧的空白缝隙*/
img {
  border: 0;  /*ie6*/
  vertical-align: middle;
}
/*让button 按钮 变成小手*/
button {
  cursor: pointer;
}
/*修改链接的默认样式*/
a {
  color: #666;
  text-decoration: none;
}
a:hover {
  color: #e33333;
}
button,
input {
  font-family: 'Microsoft YaHei', 'Heiti SC', tahoma, arial, 'Hiragino Sans GB', \\5B8B\4F53, sans-serif;
}

body {
  background-color: #fff;
  font: 12px/1.5 'Microsoft YaHei', 'Heiti SC', tahoma, arial, 'Hiragino Sans GB', \\5B8B\4F53, sans-serif;
  color: #666;
}
html, body, #app {
  width: 100%;
  height: 100%;
}
</style>
