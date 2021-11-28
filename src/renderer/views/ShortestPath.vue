<template>
  <el-container class="shortestPath">
    <el-header>
      <Header title="最短路径 - Dijkstra"/>
    </el-header>
    <el-main>
      <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions"/>
    </el-main>
    <el-footer>
      <el-button type="info" @click="configureDialogVisible = true">配 置</el-button>
      <el-button @click="handleExample(0)">样 例 1</el-button>
      <el-button @click="handleExample(1)">样 例 2</el-button>
      <el-button @click="handleExample(2)">样 例 3</el-button>
      <el-button type="primary" @click="handleCount">计 算</el-button>
    </el-footer>

    <el-dialog v-drag title="配置" :visible.sync="configureDialogVisible" width="80%">
      <el-tabs v-model="configureTabName" type="card">
        <el-tab-pane label="点配置" name="1">
          <el-form ref="form" :model="configureForm" label-width="80px">
            <el-form-item label="顶点数">
              <!--<el-input v-model="configureForm.nodeNum"></el-input>-->
              <el-select v-model="configureForm.nodeNum" placeholder="请选择">
                <el-option
                  v-for="item in 8"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
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
    <el-dialog v-drag class="resDialog" title="结果" :visible.sync="resDialogVisible" width="60%">
      <h2>源点为：{{ getCharByIndex(configureForm.origin) }}</h2>
      <h2>到其它各点的距离为：</h2>
      <p v-if="configureForm.origin !== index" v-for="(item, index) in resTableData" :key="index">源点到点
        {{ getCharByIndex(index) }} 的距离为： {{ item }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resDialogVisible = false">关 闭</el-button>
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
      },
      // 结果相关
      resTableData: undefined,
      resDialogVisible: false,
      // 样例
      configureFormExample: [
        {
          nodeNum: 6,
          origin: 0,
          links: [
            {
              start: "0",
              end: "1",
              value: "1"
            },
            {
              start: "0",
              end: "2",
              value: "12"
            },
            {
              start: "1",
              end: "2",
              value: "9"
            },
            {
              start: "1",
              end: "3",
              value: "3"
            },
            {
              start: "2",
              end: "4",
              value: "5"
            },
            {
              start: "3",
              end: "2",
              value: "4"
            },
            {
              start: "3",
              end: "4",
              value: "13"
            },
            {
              start: "3",
              end: "5",
              value: "15"
            },
            {
              start: "4",
              end: "5",
              value: "4"
            }
          ]
        },
        {
          nodeNum: 6,
          origin: 0,
          links: [
            {
              start: "0",
              end: "1",
              value: "1"
            },
            {
              start: "0",
              end: "2",
              value: "2"
            },
            {
              start: "1",
              end: "2",
              value: "1"
            },
            {
              start: "1",
              end: "3",
              value: "3"
            },
            {
              start: "1",
              end: "5",
              value: "7"
            },
            {
              start: "2",
              end: "3",
              value: "1"
            },
            {
              start: "2",
              end: "4",
              value: "2"
            },
            {
              start: "3",
              end: "5",
              value: "3"
            },
            {
              start: "4",
              end: "5",
              value: "6"
            }
          ]
        },
        {
          nodeNum: 4,
          origin: 2,
          links: [
            {
              start: "0",
              end: "1",
              value: "4"
            },
            {
              start: "1",
              end: "0",
              value: "3"
            },
            {
              start: "2",
              end: "0",
              value: "9"
            },
            {
              start: "2",
              end: "3",
              value: "1"
            },
            {
              start: "3",
              end: "1",
              value: "7"
            }
          ]
        }
      ]
    }
  },
  methods: {
    /**
     * 根据ASCII值获取对应的字符
     * @param index
     * @returns {string}
     */
    getCharByIndex(index) {
      return String.fromCharCode('A'.charCodeAt(0) + index)
    },
    /**
     * 编辑对话框中，添加边
     */
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
    /**
     * 将数据转为图组件所需的JSON格式
     */
    transformDataToJson(nodeNum, aLinks, rootId) {
      let nodes = []
      for (let i = 0; i < nodeNum; i++) {
        let node = {
          id: i.toString(),
          text: this.getCharByIndex(i),
          color: i === rootId ? '#FF0000' : undefined
        }
        nodes.push(node)
      }
      let links = []
      aLinks.forEach(item => {
        let link = {
          from: item.start.toString(),
          to: item.end.toString(),
          text: item.value.toString()
        }
        links.push(link)
      })
      return {
        rootId: rootId,
        nodes: nodes,
        links: links
      }
    },
    /**
     * 读取编辑对话框中的参数，转换为json，传入组件生成图
     */
    handleConfigure() {
      let data = this.transformDataToJson(this.configureForm.nodeNum, this.configureForm.links, this.configureForm.origin);
      let that = this
      this.$refs.seeksRelationGraph.setJsonData({...data}, () => {
        that.configureDialogVisible = false
      })
    },
    /**
     * 获取图的样例
     */
    handleExample(index) {
      this.configureForm = {...this.configureFormExample[index]}
      this.handleConfigure()
    },
    /**
     * 计算并展示计算结果
     */
    handleCount() {
      this.resTableData = this.count()
      this.resDialogVisible = true
    },
    /**
     * 计算最短路径
     * @returns {any[]}
     */
    count() {
      let max = 99999
      let nodeNum = parseInt(this.configureForm.nodeNum)
      let origin = parseInt(this.configureForm.origin)

      // 初始化
      // 初始化点到点的距离
      let distance = []
      for (let i = 0; i < nodeNum; i++) {
        let item = new Array(nodeNum).fill(max)
        item[i] = 0
        distance.push(item)
      }
      this.configureForm.links.forEach(item => {
        distance[item.start][item.end] = parseInt(item.value)
      })
      // 初始化点到源点的距离
      let distanceToOrigin = new Array(nodeNum)
      for (let i = 0; i < nodeNum; i++) {
        distanceToOrigin[i] = distance[origin][i]
      }
      // 初始化标记数组，用于标识点的最短路径是否已找到
      let flag = new Array(nodeNum).fill(0)
      flag[origin] = 1

      // 计算
      for (let i = 0; i < nodeNum; i++) {
        let min = max
        let tempNode
        // 找到距源点最近的点，加入
        for (let j = 0; j < nodeNum; j++) {
          if (flag[j] === 0 && distanceToOrigin[j] < min) {
            min = distanceToOrigin[j]
            tempNode = j
          }
        }
        flag[tempNode] = 1
        // 根据新加入的点更新点到源点的距离
        for (let j = 0; j < nodeNum; j++) {
          if (flag[j] === 0 && distance[tempNode][j] < max && distanceToOrigin[j] > distanceToOrigin[tempNode] + distance[tempNode][j]) {
            distanceToOrigin[j] = distanceToOrigin[tempNode] + distance[tempNode][j]
          }
        }
      }
      return distanceToOrigin
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

  .resDialog {
    p {
      font-size: 18px;
      margin: 10px 0;
    }

  }
}
</style>