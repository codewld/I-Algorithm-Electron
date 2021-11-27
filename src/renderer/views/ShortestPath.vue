<template>
  <el-container class="shortestPath">
    <el-header>
      <Header title="最短路径 - Dijkstra"/>
    </el-header>
    <el-main v-loading="loading">
      <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions"/>
    </el-main>
    <el-footer>
      <el-button type="info" @click="configureDialogVisible = true">配 置</el-button>
      <el-button type="primary" @click="count">计 算</el-button>
    </el-footer>

    <el-dialog title="配置" :visible.sync="configureDialogVisible" width="80%">
      <el-tabs v-model="configureTabName" type="card">
        <el-tab-pane label="点配置" name="1">
          <el-form ref="form" :model="configureForm" label-width="80px">
            <el-form-item label="顶点数">
              <el-input v-model="configureForm.nodeNum" @input="configureFormNodeNumInput"></el-input>
            </el-form-item>
            <el-form-item label="选择源点">
              <el-select v-model="configureForm.origin" placeholder="请选择">
                <el-option v-for="(item, index) in configureForm.nodeNum ? parseInt(configureForm.nodeNum) : 0"
                           :key="index"
                           :label="getCharByIndex(index)" :value="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="边配置" name="2">
          <el-form ref="form" :model="configureForm">
            <el-form-item>
              <el-row style="margin: 10px 0">
                <el-button round @click="addLinks">添加边</el-button>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-table :data="configureForm.links">
                <el-table-column label="起点">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.start" placeholder="请选择" v-show="!scope.row.disabled">
                      <el-option v-for="(item, index) in configureForm.nodeNum ? parseInt(configureForm.nodeNum) : 0"
                                 :key="index"
                                 :label="getCharByIndex(index)" :value="index" :disabled="index === scope.row.end">
                      </el-option>
                    </el-select>
                    <span v-show="scope.row.disabled">{{ getCharByIndex(scope.row.start) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="终点" prop="end">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.end" placeholder="请选择" v-show="!scope.row.disabled">
                      <el-option v-for="(item, index) in configureForm.nodeNum ? parseInt(configureForm.nodeNum) : 0"
                                 :key="index"
                                 :label="getCharByIndex(index)" :value="index" :disabled="index === scope.row.start">
                      </el-option>
                    </el-select>
                    <span v-show="scope.row.disabled">{{ getCharByIndex(scope.row.end) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="权重" prop="value">
                  <template slot-scope="scope">
                    <el-input placeholder="请输入内容" v-show="!scope.row.disabled" v-model="scope.row.value"></el-input>
                    <span v-show="scope.row.disabled">{{ scope.row.value }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="scope.row.disabled = false"
                               :disabled="scope.row.disabled === false"></el-button>
                    <el-button type="success" icon="el-icon-check" circle @click="scope.row.disabled = true"
                               :disabled="scope.row.disabled === true"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configureDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleConfigure">保存</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import SeeksRelationGraph from "relation-graph";
import Header from "../components/Header";

export default {
  name: "ShortestPath",
  components: {SeeksRelationGraph, Header},
  data() {
    return {
      loading: false,
      // 图表选项
      graphOptions: {
        allowShowMiniToolBar: false,
        allowShowMiniNameFilter: false,
        allowSwitchLineShape: false,
        allowSwitchJunctionPoint: false,
        moveToCenterWhenResize: false,
        defaultFocusRootNode: false,
        allowShowZoomMenu: false,
        defaultJunctionPoint: 'border',
        layouts: [
          {
            'label': '自动布局',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-force'
          }
        ]
      },
      // 配置相关
      configureDialogVisible: false,
      configureTabName: '1',
      configureForm: {
        nodeNum: undefined,
        origin: undefined,
        links: []
      }
    }
  },
  mounted() {
    // this.showSeeksGraph()
  },
  computed: {},
  methods: {
    configureFormNodeNumInput(value) {
      if (value < this.configureForm.origin) {
        this.configureForm.origin = null
      }
    },
    getCharByIndex(index) {
      return String.fromCharCode('A'.charCodeAt(0) + index)
    },
    addLinks() {
      this.configureForm.links.forEach(item => {
        item.disabled = true
      })
      let tempRow = {
        start: undefined,
        end: undefined,
        value: undefined,
        disabled: false
      }
      this.configureForm.links.push(tempRow)
    },
    handleConfigure() {
      let nodes = []
      for (let i = 0; i < this.configureForm.nodeNum; i++) {
        let node = {
          id: i.toString(),
          text: this.getCharByIndex(i)
          // color: this.configureForm.origin === i ? '#43a2f1' : null
        }
        nodes.push(node)
      }
      let links = []
      this.configureForm.links.forEach(item => {
        let link = {
          from: item.start.toString(),
          to: item.end.toString(),
          text: item.value.toString()
        }
        links.push(link)
      })
      let rootId = this.configureForm.origin
      let data = {
        rootId: rootId,
        nodes: nodes,
        links: links
      }
      let that = this
      this.$refs.seeksRelationGraph.setJsonData({...data}, () => {
        that.configureDialogVisible = false
      })
    },
    count() {
      let max = 999

      // this.loading = true
      // setTimeout(() => {
      //   this.loading = false
      // }, 1000)

      // 初始化距离数组
      let distance = []
      for (let i = 0; i < 6; i++) {
        let item = new Array(6)
        distance.push(item)
      }
      // this.configureForm.links.forEach(item => {
      //   distance[item.start][item.end] = item.value
      // })

      distance[0][1] = 1
      distance[0][2] = 12
      distance[1][2] = 9
      distance[1][3] = 3
      distance[2][4] = 5
      distance[3][2] = 4
      distance[3][4] = 13
      distance[3][5] = 15
      distance[4][5] = 4


      // console.log("--distance--")
      // console.log(distance)
      // console.log("--distance--")

      // 初始化结果数组
      // let res = new Array(parseInt(this.configureForm.nodeNum))
      // for (let i = 1; i < this.configureForm.nodeNum; i++) {
      //   res[i] = distance[this.configureForm.origin][i]
      // }
      let res = new Array(6)
      res[0] = 0
      res[1] = 1
      res[2] = 12
      // console.log("--res--")
      // console.log(res)
      // console.log("--res--")

      // 初始化标记数组
      // let flag = new Array(parseInt(this.configureForm.nodeNum))
      // flag[this.configureForm.origin] = 1
      let flag = new Array(6)
      flag[0] = 1
      // console.log("--flag--")
      // console.log(flag)
      // console.log("--flag--")

      // 计算
      for (let i = 0; i < 6; i++) {
        let min = 9999
        let tempNode
        for (let j = 0; j < 6; j++) {
          // 如果节点未加入且距离源点路径最小
          if (flag[j] !== 1 && res[j] < min) {
            min = res[j]
            tempNode = j
          }
        }
        console.log("tempNode:" +tempNode)
        console.log("min:" + min)
        flag[tempNode] = 1
        for (let j = 0; j < 6; j++) {
          if (flag[j] !== 1 && distance[tempNode][j]) {
            if (res[j] > res[tempNode] + distance[tempNode][j] || !res[j]) {
              res[j] = res[tempNode] + distance[tempNode][j]
            }
          }
        }
      }
      console.log("--res--")
      console.log(res)
      console.log("--res--")

    }
  }
}
</script>

<style scoped lang="scss">
.shortestPath {
  height: 100%;

  .el-header {
    border-bottom: 1px solid #e6e6e6;
    box-sizing: border-box;
  }

  .el-footer {
    padding: 0 50px;
    border-top: 1px solid #e6e6e6;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .el-main {
    width: 100%;
    height: 100%;
  }
}
</style>