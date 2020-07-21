<template>
  <div class="som-container">
    <!-- UMartix -->
    <v-chart
      ref="unitMatrixRef"
      class="umartix-container"
      theme="infographic"
      :options="uMatrixOpt"
      @click="uMatrixItemClicked"
      @dblclick="uMatrixItemdbClicked"
    ></v-chart>
    <!-- WeightMartix -->
    <v-chart
      ref="weightMartixRef"
      class="wmartix-container"
      theme="infographic"
      :options="wMatrixOpt"
    ></v-chart>
    <!-- Tree-List -->
    <v-chart class="tree-chart" ref="treeChartRef" v-if="!showTree"></v-chart>
    <div class="tree-list" v-if="showTree">
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
      </vue-tree-list>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-document-checked"
        @click="saveClusterTreeList"
      >Save Data</el-button>
    </div>
    <!-- 平行坐标图和散点图 -->
    <swiper class="swiper" :options="chartSwiperOptions">
      <swiper-slide>
        <v-chart ref="paralleRef" :options="paralleOpt" @axisareaselected="selectedAreaOnParalle"></v-chart>
      </swiper-slide>
      <swiper-slide>
        <v-chart ref="scatterRef" theme="infographic" :options="timeSeriesScatterOpt"></v-chart>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
// 按需导入 Echarts 组件
import 'echarts/theme/infographic.js'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/parallelAxis'
import 'echarts/lib/component/parallel'
import 'echarts/lib/component/dataZoom'
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
			// 样本数据原数据，无类别标识
			sampleDataSet: [],
			// UMatrix 配置项
			uMatrixOpt: {
				title: {
					text: 'U-Matrix',
					left: 7,
					top: 3
				},
				xAxis: {
					type: 'category',
					show: false
				},
				yAxis: {
					type: 'category',
					show: false
				},
				grid: {
					left: 7,
					right: 7,
					top: 45,
					bottom: 1
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
						data: [], // [x, y, dis, unitId]
						type: 'heatmap',
						label: {
							show: false, // 暂时不显示
							position: 'insideBottomLeft',
							color: '#000',
							formatter: p => p.data[3],
							distance: 0,
							fontSize: 10
						},
						itemStyle: {
							normal: {},
							emphasis: {
								borderWidth: 1,
								borderColor: 'black'
							}
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
				title: {
					text: 'Component Plane',
					left: 7,
					top: 3
				},
				grid: {
					left: 7,
					right: 7,
					top: 45,
					bottom: 1
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
			// tree 和 loading 的显示
			showTree: false,
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
			]),
			// 平行坐标图与时序散点图切换 swiper 配置项
			chartSwiperOptions: {
				noSwiping: true,
				pagination: '.swiper-pagination',
				paginationClickable: true,
				simulateTouch: false
			},
			// 平行坐标图配置项
			paralleOpt: {
				toolbox: {
					feature: {
						brush: {
							type: ['clear'],
							transformable: false,
							seriesIndex: 'all',
							throttleType: 'debounce',
							throttleDelay: 1000,
							title: {
								clear: 'clear'
							}
						}
					},
					top: 0,
					right: 30
					/* tooltip: {
						textStyle: {
							fontSize: 10
						}
					} */
				},
				parallel: {
					left: 35,
					right: 45
				},
				parallelAxis: [
					{ dim: 3, name: "Maoram's I" },
					{ dim: 4, name: 'Mode' },
					{ dim: 5, name: 'Qd' },
					{ dim: 6, name: 'Skewness' },
					{ dim: 7, name: 'Ex_Kurtosis' }
				],
				series: []
			},
			// 时序散点图配置项
			timeSeriesScatterOpt: {
				xAxis: { type: 'category' },
				yAxis: {
					type: 'category',
					name: 'regionID',
					nameTextStyle: {
						padding: [0, 0, 0, 20]
					}
				},
				grid: {
					left: 35,
					right: 25,
					bottom: 80
				},
				tooltip: {
					confine: true,
					formatter: p => `Date: ${p.data[0]}<br/>RegionID: ${p.data[1]}`
				},
				dataZoom: {
					type: 'slider',
					start: 0,
					end: 100,
					showDataShadow: false,
					handleIcon:
						'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
					handleSize: '50%',
					bottom: 30
				},
				series: {
					symbolSize: 10,
					data: [], // [x, y, unitId, clusterId]
					type: 'scatter',
					itemStyle: {
						color: p => this.clustersColors[p.data[3]]
					}
				}
			},
			selectedUnitIndex: [], // 选中项索引
			selectedUnitIdOnUMatrix: [], // 选中的日期
			timer: null, // 延时器
			itemSeriesHightlightDataIndex: [] //
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
				this.$refs.unitMatrixRef.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
				this.$refs.weightMartixRef.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
				this.$refs.paralleRef.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
				this.$refs.treeChartRef.showLoading({
					text: 'Loading…',
					color: '#409EFF',
					maskColor: 'rgba(255, 255, 255, 0.4)'
				})
			} else {
				this.$refs.unitMatrixRef.hideLoading()
				this.$refs.weightMartixRef.hideLoading()
				this.$refs.paralleRef.hideLoading()
				this.$refs.treeChartRef.hideLoading()
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
				this.uMatrixOpt.series[0].data = res.data.UMatrix // [x, y, dis, unitId]
				this.unitCountData = res.data.unitCount // 保存原数据
				const unitCount = res.data.unitCount
				for (const item of unitCount) {
					item.push(this.getClusterID(item[3])) // [x, y, count, unitId, clusterId]
				}
				this.uMatrixOpt.series[1].data = unitCount

				// 权重矩阵
				this.wMatrixOpt.xAxis.max = res.data.size
				this.wMatrixOpt.yAxis.max = res.data.size
				const seriesData = this.getPieMartrixSeries(res.data.weightsMatrix)
				this.$refs.weightMartixRef.mergeOptions({
					series: [
						{
							name: 'cluster',
							symbolSize: 35,
							hoverAnimation: false,
							type: 'scatter',
							data: seriesData.scatterSeriesData, // [x, y, unitId, clusterId]
							itemStyle: {
								color: p => this.clustersColors[p.data[3]]
							},
							tooltip: {
								formatter: p => `Unit ${p.data[2]}`
							}
						},
						{
							symbolSize: 30,
							// hoverAnimation: false,
							type: 'scatter',
							data: seriesData.scatterSeriesData, // [x, y, unitId, clusterId]
							itemStyle: {
								color: '#fff',
								opacity: 1
							},
							tooltip: {
								show: false
							},
							slient: true,
							animation: false,
							z: 10
						}
					]
				})

				this.$refs.weightMartixRef.mergeOptions({
					tooltip: {
						formatter: p => `${p.marker}${p.name}：${p.value.toFixed(4)}`
					},
					legend: {
						data: ["Moran's I", 'Mode', 'Qd', 'Skewness', 'Excess_Kurtosis'],
						formatter: name => {
							if (name === 'Excess_Kurtosis') return 'Ex_Kurtosis'
							return name
						},
						selectedMode: false,
						icon: 'circle',
						itemWidth: 7,
						itemHeight: 7,
						textStyle: {
							fontSize: 12,
							color: '#ffff0'
						},
						top: 23
					},
					series: seriesData.pieSeries
				})

				// 平行坐标轴
				this.sampleDataSet = res.data.dataSet // 保存原数据
				const seriesDataObj = this.getParallelAndScatterData(res.data.dataSet)
				this.paralleOpt.series = seriesDataObj.parallelSeries

				// 时序散点图
				this.timeSeriesScatterOpt.series.data = seriesDataObj.scatterData

				this.showTree = true
				this.isShowLoadding(false)
			}
		},
		// 获取权重矩阵图数据
		getPieMartrixSeries(weightsMatrix) {
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
		// 获取平行坐标轴数据，时序散点
		getParallelAndScatterData(dataSet) {
			const parallelSeries = []
			const scatterData = []
			// 根据类别颜色数创建数组，类别数
			for (let i = 0; i < this.clustersColors.length; i++) {
				parallelSeries.push({
					type: 'parallel',
					lineStyle: {
						color: this.clustersColors[i],
						width: 2
					},
					data: []
				})
			}
			for (const item of dataSet) {
				// item ['201501-1', '201501', '1', MI, Mo, Qd, Sk, EK, unitId]
				const clusterId = this.getClusterID(item[8])
				// item.push(clusterId)
				// arr[clusterId].push(item)
				parallelSeries[clusterId].data.push(item)
				scatterData.push([item[1], item[2], item[8], clusterId]) // [x, y, unitId, clusterId]
			}
			return { parallelSeries, scatterData }
		},
		// 为类选择了新的 color
		changeClusterColor() {
			// uMaxtrix 配色改变
			this.$refs.unitMatrixRef.mergeOptions({
				series: {
					itemStyle: {}
				}
			})
			// 权重矩阵配色改变
			this.$refs.weightMartixRef.mergeOptions({
				series: {
					itemStyle: {}
				}
			})
			// 平行坐标图配色改变
			// 更新平行坐标图
			const seriesDataObj = this.getParallelAndScatterData(this.sampleDataSet)
			this.paralleOpt.series = seriesDataObj.parallelSeries
			// 时序散点图配色改变
			this.$refs.scatterRef.mergeOptions({
				series: {
					itemStyle: {}
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
			// const moveUnitId = params.node.unitId
			const targetClusterId = params.target.clusterId
			if (typeof targetClusterId !== 'undefined') {
				const newUnitCountData = []
				const newClusterScatterData = []
				for (const item of this.unitCountData) {
					newUnitCountData.push([
						item[0],
						item[1],
						item[2],
						item[3],
						this.getClusterID(item[3])
					]) // [x, y, count, unitId, clusterId]
				}
				for (const item of this.clusterScatterData) {
					newClusterScatterData.push([
						item[0],
						item[1],
						item[2],
						this.getClusterID(item[2])
					]) // [x, y, unitId, clusterId]
				}
				this.uMatrixOpt.series[1].data = newUnitCountData

				this.$refs.weightMartixRef.mergeOptions({
					series: {
						data: newClusterScatterData, // [x, y, unitId, clusterId]
						itemStyle: {
							color: p => this.clustersColors[p.data[3]]
						}
					}
				})

				// 更新平行坐标图
				const seriesDataObj = this.getParallelAndScatterData(this.sampleDataSet)
				this.paralleOpt.series = seriesDataObj.parallelSeries

				// 更新时序散点图
				this.timeSeriesScatterOpt.series.data = seriesDataObj.scatterData
			} else {
				return 0
			}
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
		},
		// UMatrix 点选
		uMatrixItemClicked(e) {
			if (e.seriesType === 'heatmap') {
				// 响应 heatmap 的 item 项
				this.selectedUnitIndex.push(e.dataIndex)
				this.selectedUnitIdOnUMatrix.push(e.data[3])
				this.$refs.unitMatrixRef.dispatchAction({
					type: 'highlight',
					dataIndex: e.dataIndex
				})

				// 同步筛选平行坐标轴
				/* this.$refs.paralleRef.mergeOptions({
					// todo bug in here
					series: {
						lineStyle: {
							color: p => {
								console.log(p.data)
								if (this.selectedUnitIdOnUMatrix.indexOf(p.data[8]) === -1) {
									return '#ccc'
								}
							}
						}
					}
				}) */

				const parallelSeries = []
				// 根据类别颜色数创建数组，类别数
				for (let i = 0; i < this.clustersColors.length; i++) {
					parallelSeries.push({
						type: 'parallel',
						lineStyle: {
							color: p => {
								if (this.selectedUnitIdOnUMatrix.indexOf(p.data[8]) === -1) {
									return 'rgb(204,204,204, 0.2)'
								} else {
									return this.clustersColors[i]
								}
							},
							width: 2
						},
						data: []
					})
				}
				for (const item of this.sampleDataSet) {
					const clusterId = this.getClusterID(item[8])
					parallelSeries[clusterId].data.push(item)
				}
				// 修改平行坐标图
				this.paralleOpt.series = parallelSeries

				for (let i = 0; i < this.timeSeriesScatterOpt.series.data.length; i++) {
					if (
						this.selectedUnitIdOnUMatrix.indexOf(
							this.timeSeriesScatterOpt.series.data[i][2]
						) !== -1
					) {
						this.itemSeriesHightlightDataIndex.push(i)
					}
				}
				// 时序散点图高亮
				this.$refs.scatterRef.dispatchAction({
					type: 'highlight',
					dataIndex: this.itemSeriesHightlightDataIndex
				})

				// 延时更改，以支持多选
				this.timer = setTimeout(() => {
					// 获取 gallery 中需要的数据 dateArr regionIDArr clolors
					this.$store.commit(
						'selectSampleDataOnSom',
						this.getSampleDetailData(this.selectedUnitIdOnUMatrix)
					)
				}, 2000)
			}
		},
		// 根据选中的 unitID 数组获取日期、海区、分类颜色等数组
		getSampleDetailData(unitIDArr) {
			// 初始化样本数组，并赋空值
			const sampleDateRegionData = new Array(unitIDArr.length)
			for (let i = 0; i < sampleDateRegionData.length; i++) {
				sampleDateRegionData[i] = []
			}
			// 初始化分类 ID 数组 和 分类颜色数组
			// const clusterIDArr = new Array(unitIDArr.length)
			const clusterColorsArr = new Array(unitIDArr.length)

			for (let i = 0; i < unitIDArr.length; i++) {
				for (const item of this.sampleDataSet) {
					if (item[8] === unitIDArr[i]) sampleDateRegionData[i].push(item[0]) // 每个 unitId 对应的样本的 date-regionID 数组
				}
				const clusterID = this.getClusterID(unitIDArr[i])
				clusterColorsArr[i] = this.clustersColors[clusterID]
			}

			// 返回的数据
			const resObj = {
				date: [],
				regionId: [],
				color: []
			}
			// 初始化空长度的 regionId、color 数组
			/* const tempArr = []
			for(let i = 0; i< sampleDateRegionData.length; i++){
				for(let j =0; j< sampleDateRegionData[i].length; j++){
					const date = sampleDateRegionData[i][j].split('-')[0]
					tempArr.push(date)
				}
			}
			const len = Array.from(new Set(tempArr)).length
			for(let i = 0; i< len; i++){
				resObj.regionId.push([])
				resObj.color.push([])
			} */

			// 遍历获取最终数据
			for (let i = 0; i < sampleDateRegionData.length; i++) {
				for (let j = 0; j < sampleDateRegionData[i].length; j++) {
					const date = sampleDateRegionData[i][j].split('-')[0]
					const region = sampleDateRegionData[i][j].split('-')[1]
					if (resObj.date.indexOf(date) === -1) {
						// 时间数组中没有该日期数据
						resObj.date.push(date)
						resObj.regionId.push([region])
						resObj.color.push([clusterColorsArr[i]])
					} else {
						// 存在该日期的数据
						const index = resObj.date.indexOf(date)
						resObj.regionId[index].push(region)
						resObj.color[index].push(clusterColorsArr[i])
					}
				}
			}
			return resObj
		},
		// UMatrix 双击取消选择
		uMatrixItemdbClicked(e) {
			// UMartix 恢复
			for (const index of this.selectedUnitIndex) {
				this.$refs.unitMatrixRef.dispatchAction({
					type: 'downplay',
					dataIndex: index
				})
			}

			this.paralleOpt.series = this.getParallelAndScatterData(
				this.sampleDataSet
			).parallelSeries

			// timescatter 恢复
			this.$refs.scatterRef.dispatchAction({
				type: 'downplay',
				dataIndex: this.itemSeriesHightlightDataIndex
			})
			// 置空
			this.itemSeriesHightlightDataIndex = []
			this.timer = null
			this.selectedUnitIndex = []
			this.selectedUnitIdOnUMatrix = []
			this.$store.commit('selectSampleDataOnSom', {
				date: [],
				regionId: [],
				color: []
			})
		},
		// 在时序散点图上 datazoom 的时候保持高亮
		dataRangeOnTimeScatter(e) {
			console.log(e)
			if (this.itemSeriesHightlightDataIndex.length !== 0) {
				console.log(e)
				this.$refs.scatterRef.dispatchAction({
					type: 'highlight',
					dataIndex: this.itemSeriesHightlightDataIndex
				})
			}
		},
		// 在平行坐标轴上进行刷选
		selectedAreaOnParalle(e) {
			// e.intervals 为该选择轴上的值区间（类别轴为起始索引，数值轴为数值上下限）
			console.log('平行坐标轴刷选了')
			/* const series0 = this.$refs.paralleRef.getModel().getSeries()[0]
			const series1 = this.$refs.paralleRef.getModel().getSeries()[1]
			const indices0 = series0.getRawIndicesByActiveState('active')
			const indices1 = series1.getRawIndicesByActiveState('active')
			console.log(indices0, indices1) */
		}
	}
}
</script>

<style lang="less" scoped>
.som-container {
	// width: 100%;
	height: 822px;
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
	.tree-chart,
	.tree-list {
		width: 28%;
		height: 410px;
		margin: 5px 0 0 7px;
		padding: 5px;
		overflow: auto;
		.el-button {
			margin-bottom: 3px;
		}
		border: 1px #ccc dashed;
	}
	.icon {
		&:hover {
			cursor: pointer;
		}
		margin-right: 5px;
	}
	.swiper {
		margin-top: 10px;
		height: 420px;
		width: 500px;
	}
}
</style>
