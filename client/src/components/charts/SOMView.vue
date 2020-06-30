<template>
  <div class="som-container">
    <!-- UMartix -->
    <v-chart ref="unitMartix" class="umartix-container" :options="uMatrixOpt"></v-chart>
    <!-- WeightMartix -->
    <v-chart ref="weightMartix" class="wmartix-container" :options="wMatrixOpt"></v-chart>
    <!-- Tree-List -->
    <div class="tree-list">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addNode">Add Cluster</el-button>
      <vue-tree-list
        @click="onClick"
        @change-name="onChangeName"
        @delete-node="onDel"
        @add-node="onAddNode"
        :model="treeData"
        default-tree-node-name="new node"
        default-leaf-node-name="new leaf"
        v-bind:default-expanded="false"
      >
        <span class="icon" slot="editNodeIcon">
          <i class="el-icon-edit"></i>
        </span>
        <span class="icon" slot="delNodeIcon">
          <i class="el-icon-delete"></i>
        </span>
        <span class="icon" slot="leafNodeIcon">
          <i class="el-icon-menu"></i>
        </span>
        <!--<template class="icon" v-slot:treeNodeIcon="slotProps"> 作用域插槽
          <el-color-picker v-model="color" size="mini"></el-color-picker>
        </template>-->
        <span class="icon" slot="treeNodeIcon">
          <el-color-picker v-model="color" :predefine="predefineColors" size="mini"></el-color-picker>
        </span>
      </vue-tree-list>
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
			color: '#409EFF',
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
			uMatrixOpt: {
				// 0 坐标轴用于两个矩阵图，1 坐标轴用于散点图
				xAxis: [
					{
						type: 'category',
						show: false
					},
					{
						type: 'value',
						min: 0,
						max: 10,
						show: false
					}
				],
				yAxis: [
					{
						type: 'category',
						show: false
					},
					{
						type: 'value',
						min: 0,
						max: 10,
						show: false
					}
				],
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
					// 聚类矩阵图
					{
						name: 'Unit',
						data: [],
						type: 'heatmap',
						xAxisIndex: 0,
						yAxisIndex: 0,
						label: {
							show: true, // 暂时不显示
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
					// 距离矩阵图
					{
						name: 'Sample Count',
						symbolSize: function(data) {
							return data[2] * 2
						},
						hoverAnimation: false,
						type: 'scatter',
						symbol: 'rect',
						xAxisIndex: 0,
						yAxisIndex: 0,
						data: [],
						itemStyle: {
							color: 'rgb(255,255,255)'
						},
						tooltip: {
							formatter: p => `Sample Count: ${p.data[2]}`
						}
					}
				]
			},
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
			newTree: {},
			treeData: new Tree([
				{
					name: 'Cluster 1',
					clusterId: 0,
					id: 1,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: [
						{
							name: 'Unit 0',
							id: 2,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 1',
							id: 3,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						}
					]
				},
				{
					name: 'Cluster 2',
					id: 4,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: [
						{
							name: 'Unit 2',
							id: 5,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 3',
							id: 6,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						}
					]
				},
				{
					name: 'Cluster 3',
					id: 5,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: [
						{
							name: 'Unit 4',
							id: 6,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 5',
							id: 7,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 4',
							id: 8,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 5',
							id: 9,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 4',
							id: 10,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 5',
							id: 11,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 4',
							id: 12,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 5',
							id: 13,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 4',
							id: 14,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 5',
							id: 15,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 4',
							id: 16,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 5',
							id: 17,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						}
					]
				}
			])
		}
	},
	components: {
		'v-chart': ECharts,
		VueTreeList
	},
	props: [],
	mounted() {
		this.getSOMResult()
	},
	methods: {
		// 是否显示缓冲条
		isShowLoadding(b) {
			if (b) {
				this.$refs.unitMartix.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
				this.$refs.weightMartix.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
			} else {
				this.$refs.unitMartix.hideLoading()
				this.$refs.weightMartix.hideLoading()
			}
		},
		// 获取 SOM Result
		async getSOMResult() {
			this.isShowLoadding(true)
			const { data: res } = await this.axios.get('som/somresult')
			if (res.meta.status !== 200) {
				this.$message.error('Failed to get matrix data!')
			} else {
				this.uMatrixOpt.visualMap.min = res.data.min
				this.uMatrixOpt.visualMap.max = res.data.max
				this.uMatrixOpt.series[0].data = res.data.UMatrix
				this.uMatrixOpt.series[1].data = res.data.unitCount

				this.wMatrixOpt.xAxis.max = res.data.size
				this.wMatrixOpt.yAxis.max = res.data.size
				const seriesData = this.getSeries(res.data.weightsMatrix)
				this.$refs.weightMartix.mergeOptions({
					series: {
						symbolSize: 31,
						hoverAnimation: false,
						type: 'scatter',
						data: seriesData.scatterSeriesData,
						itemStyle: {
							color: 'rgb(0,0,0, 0)',
							borderColor: '#ccc',
							borderWidth: 2
						},
						tooltip: {
							formatter: p => `Unit ${p.data[2]}`
						}
					}
				})
				this.$refs.weightMartix.mergeOptions({
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
				const center = this.$refs.weightMartix.convertToPixel(
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
					radius: 15,
					roseType: 'radius',
					data: item[2]
				})
				scatterSeriesData.push([item[0], item[1], item[3]])
			}
			return { pieSeries, scatterSeriesData }
		},
		// tree
		onDel(node) {
			console.log(node)
			node.remove()
		},

		onChangeName(params) {
			console.log(params)
		},

		onAddNode(params) {
			console.log(params)
		},

		onClick(params) {
			console.log(params)
		},

		addNode() {
			var node = new TreeNode({
				name: 'new Cluster',
				isLeaf: false,
				dragDisabled: true,
				addTreeNodeDisabled: true,
				addLeafNodeDisabled: true,
				editNodeDisabled: false,
				delNodeDisabled: false
			})
			if (!this.treeData.children) this.treeData.children = []
			this.treeData.addChildren(node)
		},

		getNewTree() {
			var vm = this
			function _dfs(oldNode) {
				var newNode = {
					colors: [] // 携带回设置好的聚类颜色
				}

				for (var k in oldNode) {
					if (k !== 'children' && k !== 'parent') {
						newNode[k] = oldNode[k]
					}
				}

				if (oldNode.children && oldNode.children.length > 0) {
					newNode.children = []
					for (var i = 0, len = oldNode.children.length; i < len; i++) {
						newNode.children.push(_dfs(oldNode.children[i]))
					}
				}
				return newNode
			}

			vm.newTree = _dfs(vm.treeData)
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
	.el-color-dropdown__link-btn {
		display: none !important;
	}
}
</style>
