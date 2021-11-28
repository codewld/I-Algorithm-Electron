<template>
  <el-container class="MST">
    <el-header>
      <Header title="最小生成树 - Kruskal"/>
    </el-header>
    <el-main>
      <SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions"/>
    </el-main>
    <el-footer>
      <el-button type="info" @click="configureDialogVisible = true">配 置</el-button>
      <el-button @click="handleExample">样 例</el-button>
      <el-button type="primary" @click="handleCount">计 算</el-button>
    </el-footer>

    <el-dialog title="配置" :visible.sync="configureDialogVisible" width="80%">
      {{configureForm}}
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
  name: "MST",
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
      // 样例
      configureFormExample1: {
        nodeNum: 6,
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
            value: "6"
          },
          {
            start: "1",
            end: "3",
            value: "11"
          },
          {
            start: "2",
            end: "3",
            value: "9"
          },
          {
            start: "2",
            end: "4",
            value: "13"
          },
          {
            start: "3",
            end: "4",
            value: "7"
          },
          {
            start: "3",
            end: "5",
            value: "3"
          },
          {
            start: "4",
            end: "5",
            value: "4"
          }
        ]
      }
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
          text: this.getCharByIndex(i)
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
    handleExample() {
      this.configureForm = {...this.configureFormExample1}
      this.handleConfigure()
    },
    /**
     * 计算并展示计算结果
     */
    handleCount() {
      let links = this.count()
      console.log(links)
      let data = this.transformDataToJson(this.configureForm.nodeNum, links, this.configureForm.origin);
      let that = this
      this.$refs.seeksRelationGraph.setJsonData({...data}, () => {
        that.configureDialogVisible = false
      })

    },
    /**
     * 计算最小生成树
     */
    count() {
      let nodeNum = parseInt(this.configureForm.nodeNum)
      let links = Array.from(this.configureForm.links)
      links.sort((a, b) => {
        return a.value - b.value
      })
      let linkNum = links.length
      let flag = 0

      //记录已经加入的点
      let hasNode = {}
      let res = []

      for (let i = 0; i < linkNum && flag < nodeNum - 1; i++) {
        let start = links[i].start;
        let end = links[i].end;
        let value = links[i].value;
        //这要起点和重点不是同时在同一个群落中即可
        if(hasNode[start] == undefined && hasNode[end] == undefined){
          //如果两个点都是没有使用过的点直接加入形成新群落
          let length = 0
          for(let index in hasNode){
            length++
          }
          hasNode[start] = length
          hasNode[end] = length
          flag++
          res.push(links[i])
        }else if(hasNode[start] == undefined && hasNode[end] != undefined){
          //出发点是新点，目的地已经存在了
          hasNode[start] = hasNode[end]
          //加入群落
          flag++
          res.push(links[i])
        }else if(hasNode[start] != undefined&&hasNode[end] == undefined){
          //目的地是新点，出发点已经存在了
          hasNode[end] = hasNode[start]
          //加入群落
          flag++
          res.push(links[i])
        }else if(hasNode[start] != hasNode[end]){
          //如果两个点都是使用过的但是不在一个群落里，那么结束点的群落就加入出发点群落
          let Community = hasNode[end]
          for(let index in hasNode){
            if(hasNode[index] == Community){
              hasNode[index] = hasNode[start]
            }
          }
          flag++
          res.push(links[i])
        }
      }

      return res
    }
  }
}
</script>

<style scoped lang="scss">
.MST {
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