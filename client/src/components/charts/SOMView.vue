<template>
  <div class="som-container">
    <!-- UMartix -->
    <v-chart ref="unitMartixRef" class="umartix-container" :options="uMatrixOpt"></v-chart>
    <!-- WeightMartix -->
    <v-chart ref="weightMartixRef" class="wmartix-container" :options="wMatrixOpt"></v-chart>
    <!-- Tree-List -->
    <div class="tree-list">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addNewCluster">Add Cluster</el-button>
      <vue-tree-list
        @delete-node="deleteCluster"
        @drop="changeUnitClusterId"
        :model="treeData"
        default-tree-node-name="New Cluster"
        v-bind:default-expanded="false"
      >
        <!-- 图标类插槽 -->
        <span class="icon" slot="editNodeIcon">
          <i class="el-icon-edit"></i>
        </span>
        <span class="icon" slot="delNodeIcon">
          <i class="el-icon-delete"></i>
        </span>
        <span class="icon" slot="leafNodeIcon">
          <i class="el-icon-menu"></i>
        </span>
        <!-- 作用域插槽 -->
        <template v-slot:treeNodeIcon="slotProps">
          <el-color-picker
            class="icon"
            v-model="clustersColors[slotProps.model.clusterId]"
            :predefine="predefineColors"
            size="mini"
            @change="changeClusterColor"
          ></el-color-picker>
        </template>
        <!-- <span class="icon" slot="treeNodeIcon">
          <el-color-picker v-model="color" :predefine="predefineColors" size="mini"></el-color-picker>
        </span>-->
      </vue-tree-list>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-document-checked"
        @click="saveClusterTreeList"
      >Add Cluster</el-button>
      <button @click="getNewTree">Get new tree</button>
      <pre>{{newTree}}</pre>
    </div>
  </div>
</template>

<script>
// 按需导入 Echarts 组件
import 'echarts/theme/infographic.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
// tree-list 组件
import { VueTreeList, Tree, TreeNode } from 'vue-tree-list'

export default {
	data() {
		return {
			// color: '#409EFF',
			// 提供的预选色
			predefineColors: [
				'#a6cee3',
				'#1f78b4',
				'#b2df8a',
				'#33a02c',
				'#fb9a99',
				'#e31a1c',
				'#fdbf6f',
				'#ff7f00',
				'#cab2d6',
				'#6a3d9a',
				'#ffff99',
				'#b15928'
			],
			// 聚类选用的颜色
			clustersColors: [
				'#1F78B4',
				'#33A02C',
				'#FB9A99',
				'#FDBF6F',
				'#6A3D9A',
				'#FFFF99'
			],
			// unit 样本统计数据，用于刷新 series，无类别标识
			unitCountData: [],
			// 散点原数据，无类别标识
			clusterScatterData: [],
			// UMatrix 配置项
			uMatrixOpt: {
				// 0 坐标轴用于两个矩阵图，1 坐标轴用于散点图
				xAxis: {
					type: 'category',
					show: false
				},
				yAxis: {
					type: 'category',
					show: false
				},
				grid: {
					left: 20,
					right: 20,
					top: 40,
					bottom: 0
					// containLabel: true
				},
				tooltip: {
					confine: true
				},
				visualMap: {
					min: 0,
					max: 10,
					precision: 4,
					calculable: false,
					orient: 'horizontal',
					left: 'center',
					dimension: 2,
					inRange: {
						color: ['#f0f0f0', '#bdbdbd', '#636363']
					},
					seriesIndex: 0,
					show: false // 暂时不显示
				},
				series: [
					// 距离矩阵图
					{
						name: 'Unit',
						data: [],
						type: 'heatmap',
						label: {
							show: false, // 暂时不显示
							position: 'insideBottomLeft',
							color: '#000',
							formatter: p => p.data[3],
							distance: 0,
							fontSize: 10
						},
						tooltip: {
							formatter: p =>
								`Unit ${p.data[3]}<br/>distances: ${p.data[2].toFixed(4)}`
						}
					},
					// unitCout
					{
						name: 'Sample Count',
						symbolSize: function(data) {
							return data[2] * 2
						},
						hoverAnimation: false,
						type: 'scatter',
						symbol: 'rect',
						data: [], // [x, y, count, unitId, clusterId]
						itemStyle: {
							color: p => this.clustersColors[p.data[4]]
						},
						tooltip: {
							formatter: p => `Sample Count: ${p.data[2]}`
						}
					}
				]
			},
			// 权重矩阵配置项
			wMatrixOpt: {
				grid: {
					left: 20,
					right: 20,
					top: 40,
					bottom: 0
					// containLabel: true
				},
				xAxis: {
					type: 'category',
					data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
					show: false
				},
				yAxis: {
					type: 'category',
					data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
					show: false
				},
				tooltip: {
					confine: true
				},
				series: []
			},
			// 修改后树结构对象
			newTree: {},
			// 绑定树结构对象
			treeData: new Tree([
				{
					id: 1,
					isLeaf: false,
					name: 'Cluster 1',
					clusterId: 0,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: []
				},
				{
					id: 2,
					isLeaf: false,
					name: 'Cluster 2',
					clusterId: 1,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: []
				},
				{
					id: 3,
					isLeaf: false,
					name: 'Cluster 3',
					clusterId: 2,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: []
				},
				{
					id: 4,
					isLeaf: false,
					name: 'Cluster 4',
					clusterId: 3,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: []
				},
				{
					id: 5,
					isLeaf: false,
					name: 'Cluster 5',
					clusterId: 4,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: []
				},
				{
					id: 6,
					isLeaf: false,
					name: 'Cluster 6',
					clusterId: 5,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: []
				}
			])
		}
	},
	components: {
		'v-chart': ECharts,
		VueTreeList
	},
	props: [],
	created() {
		this.getClusterTreeData() // 先获取该数据，因为图表要使用该数据
	},
	mounted() {
		this.getSOMResult()
	},
	methods: {
		// 是否显示缓冲条
		isShowLoadding(b) {
			if (b) {
				this.$refs.unitMartixRef.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
				this.$refs.weightMartixRef.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
			} else {
				this.$refs.unitMartixRef.hideLoading()
				this.$refs.weightMartixRef.hideLoading()
			}
		},
		// 获取聚类树数据
		async getClusterTreeData() {
			const { data: res } = await this.axios.get('/som/clustertree')
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get Cluster-Tree data!')
			} else {
				// 获取颜色数组
				this.clustersColors = res.data.colors
				// 为树结构的数据赋值
				// console.log(res.data.children)
				this.treeData = new Tree(res.data.children)
			}
		},
		// 前端根据 unitId 将节点内的样本进行划分
		getClusterID(unitID) {
			// 遍历分类树
			for (const clusterObj of this.treeData.children) {
				for (const unitObj of clusterObj.children) {
					if (unitObj.unitId === unitID) {
						return clusterObj.clusterId
					}
				}
			}
		},
		// 获取 SOM Result
		async getSOMResult() {
			this.isShowLoadding(true)
			const { data: res } = await this.axios.get('som/somresult')
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get matrix data!')
			} else {
				// UMatrix 矩阵
				this.uMatrixOpt.visualMap.min = res.data.min
				this.uMatrixOpt.visualMap.max = res.data.max
				this.uMatrixOpt.series[0].data = res.data.UMatrix
				this.unitCountData = res.data.unitCount // 保存原数据
				const unitCount = res.data.unitCount
				for (const item of unitCount) {
					item.push(this.getClusterID(item[3])) // [x, y, count, unitId, clusterId]
				}
				this.uMatrixOpt.series[1].data = unitCount

				// 权重矩阵
				this.wMatrixOpt.xAxis.max = res.data.size
				this.wMatrixOpt.yAxis.max = res.data.size
				const seriesData = this.getSeries(res.data.weightsMatrix)
				this.$refs.weightMartixRef.mergeOptions({
					series: {
						symbolSize: 31,
						hoverAnimation: false,
						type: 'scatter',
						data: seriesData.scatterSeriesData, // [x, y, unitId, clusterId]
						itemStyle: {
							color: p => this.clustersColors[p.data[3]]
						},
						tooltip: {
							formatter: p => `Unit ${p.data[2]}`
						}
					}
				})
				this.$refs.weightMartixRef.mergeOptions({
					legend: {
						data: ["Moran's I", 'Mode', 'Qd', 'Skewness', 'Excess_Kurtosis'],
						icon: 'circle',
						itemWidth: 7,
						itemHeight: 7,
						textStyle: {
							fontSize: 12,
							color: '#ffff0'
						},
						top: 5
					},
					series: seriesData.pieSeries
				})
				this.isShowLoadding(false)
			}
		},
		getSeries(weightsMatrix) {
			const pieSeries = []
			const scatterSeriesData = []
			for (const item of weightsMatrix) {
				// 获取饼图的中心点
				const center = this.$refs.weightMartixRef.convertToPixel(
					{ xAxisIndex: 0, yAxisIndex: 0 },
					[item[0] + '', item[1] + '']
				)
				pieSeries.push({
					id: item[3],
					type: 'pie',
					center: center,
					animation: false,
					label: {
						show: false
					},
					z: 99,
					radius: 15,
					roseType: 'radius',
					data: item[2]
				})
				// 保留原始数据
				this.clusterScatterData.push([item[0] + '', item[1] + '', item[3]])
				scatterSeriesData.push([
					item[0],
					item[1],
					item[3],
					this.getClusterID(item[3])
				]) // [x, y, unitId, clusterId]
			}
			return { pieSeries, scatterSeriesData }
		},
		// 为类选择了新的peise
		changeClusterColor() {
			// uMaxtrix 配色改变
			this.$refs.unitMartixRef.mergeOptions({
				series: {
					itemStyle: {
						color: p => this.clustersColors[p.data[4]]
					}
				}
			})
			// 权重矩阵配色改变
			this.$refs.weightMartixRef.mergeOptions({
				series: {
					itemStyle: {
						color: p => this.clustersColors[p.data[3]]
					}
				}
			})
		},
		// 删除根节点（cluster）
		deleteCluster(node) {
			if (node.children && node.children.length !== 0) {
				// 有孩子结点
				return this.$message.error('Delete Failed：This node has children！')
			} else {
				// 改变 clusterId
				// 不改变 id， id 一直往后迭代
				this.clustersColors.pop()
				node.remove()
			}
		},
		// 添加新的类
		addNewCluster() {
			this.clustersColors.push('') // 添加一种空颜色
			const node = new TreeNode({
				isLeaf: false,
				clusterId: this.clustersColors.length - 1,
				dragDisabled: true,
				addTreeNodeDisabled: true,
				addLeafNodeDisabled: true,
				editNodeDisabled: false,
				delNodeDisabled: false
			})
			if (!this.treeData.children) this.treeData.children = []
			this.treeData.addChildren(node)
		},
		// 获取修改后的分类树结构
		getNewTree() {
			const vm = this
			function _dfs(oldNode) {
				const newNode = {
					colors: vm.clustersColors // 携带回设置好的聚类颜色
				}
				for (const k in oldNode) {
					if (k !== 'children' && k !== 'parent') {
						newNode[k] = oldNode[k]
					}
				}
				if (oldNode.children && oldNode.children.length > 0) {
					newNode.children = []
					for (let i = 0; i < oldNode.children.length; i++) {
						newNode.children.push(_dfs(oldNode.children[i]))
					}
				}
				return newNode
			}
			vm.newTree = _dfs(vm.treeData)
		},
		// 拖动修改 unit 所属的类
		/**
		 * params
		 * node 拖拽的节点
		 * src 拖拽的节点的父节点
		 * target 拖拽节点的目标节点
		 */
		changeUnitClusterId(params) {
			console.log(this.uMatrixOpt.series[1].data)
			const moveUnitId = params.node.unitId
			const targetClusterId = params.target.clusterId
			if (typeof target !== 'undefined') {
				this.uMatrixOpt.series[1].data.forEach((item, index, arr) => {
					if (item[3] === moveUnitId) arr[index][4] = targetClusterId
				})
				this.wMatrixOpt.series[0].data.forEach((item, index, arr) => {
					if (item[2] === moveUnitId) arr[index][3] = targetClusterId
				})
			}
			console.log(this.uMatrixOpt.series[1].data)
		},

		// 将分类结构传递给后台保存
		async saveClusterTreeList() {
			this.getNewTree()
			const childrenData = this.newTree.children
			const { data: res } = await this.axios.put('som/clustertree/root', {
				children: childrenData
			})
			if (res.meta.status !== 200) {
				this.$message.error('保存失败！')
			} else {
				this.$message.success('保存成功！')
			}
		}
	}
}
</script>

<style lang="less" scoped>
.som-container {
	width: 100%;
	height: 805px;
	display: flex;
	flex-wrap: wrap;
	.umartix-container {
		width: 365px;
		height: 390px;
	}
	.wmartix-container {
		width: 365px;
		height: 390px; /*  */
	}
	.tree-list {
		width: 30%;
		height: 415px;
		margin: 10px 0 0 10px;
		overflow: auto;
		.el-button {
			margin-bottom: 3px;
		}
	}
	.icon {
		&:hover {
			cursor: pointer;
		}
		margin-right: 5px;
	}
}
</style>
