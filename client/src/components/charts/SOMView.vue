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
        @drap="changeUnitClusterId"
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
            @change="changeClusterColor(slotProps.model.clusterId)"
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
							unitId: 0,
							id: 7,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 1',
							unitId: 1,
							id: 8,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 2',
							unitId: 2,
							id: 9,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 3',
							unitId: 3,
							id: 10,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 4',
							unitId: 4,
							id: 11,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 10',
							unitId: 10,
							id: 12,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 11',
							unitId: 11,
							id: 13,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 12',
							unitId: 12,
							id: 14,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 13',
							unitId: 13,
							id: 15,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 14',
							unitId: 14,
							id: 16,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 20',
							unitId: 20,
							id: 17,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 21',
							unitId: 21,
							id: 18,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 22',
							unitId: 22,
							id: 19,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 23',
							unitId: 23,
							id: 20,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 24',
							unitId: 24,
							id: 21,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 30',
							unitId: 30,
							id: 22,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 40',
							unitId: 40,
							id: 23,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 50',
							unitId: 50,
							id: 24,
							isLeaf: true,
							pid: 1,
							editNodeDisabled: true,
							delNodeDisabled: true
						}
					]
				},
				{
					name: 'Cluster 2',
					clusterId: 1,
					id: 2,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: [
						{
							name: 'Unit 5',
							unitId: 5,
							id: 25,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 6',
							unitId: 6,
							id: 26,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 7',
							unitId: 7,
							id: 27,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 8',
							unitId: 8,
							id: 28,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 9',
							unitId: 9,
							id: 29,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 15',
							unitId: 15,
							id: 30,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 16',
							unitId: 16,
							id: 31,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 17',
							unitId: 17,
							id: 32,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 18',
							unitId: 18,
							id: 33,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 19',
							unitId: 19,
							id: 34,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 25',
							unitId: 25,
							id: 35,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 26',
							unitId: 26,
							id: 36,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 27',
							unitId: 27,
							id: 37,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 28',
							unitId: 28,
							id: 38,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 29',
							unitId: 29,
							id: 39,
							isLeaf: true,
							pid: 2,
							editNodeDisabled: true,
							delNodeDisabled: true
						}
					]
				},
				{
					name: 'Cluster 3',
					clusterId: 2,
					id: 3,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: [
						{
							name: 'Unit 31',
							unitId: 31,
							id: 40,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 32',
							unitId: 32,
							id: 41,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 33',
							unitId: 33,
							id: 42,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 41',
							unitId: 41,
							id: 43,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 42',
							unitId: 42,
							id: 44,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 43',
							unitId: 43,
							id: 45,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 51',
							unitId: 51,
							id: 46,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 52',
							unitId: 52,
							id: 47,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 53',
							unitId: 53,
							id: 48,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 62',
							unitId: 62,
							id: 49,
							isLeaf: true,
							pid: 3,
							editNodeDisabled: true,
							delNodeDisabled: true
						}
					]
				},
				{
					name: 'Cluster 4',
					clusterId: 3,
					id: 4,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: [
						{
							name: 'Unit 34',
							unitId: 34,
							id: 50,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 35',
							unitId: 35,
							id: 51,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 36',
							unitId: 36,
							id: 52,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 37',
							unitId: 37,
							id: 53,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 38',
							unitId: 38,
							id: 54,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 39',
							unitId: 39,
							id: 55,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 44',
							unitId: 44,
							id: 56,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 45',
							unitId: 45,
							id: 57,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 46',
							unitId: 46,
							id: 58,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 47',
							unitId: 47,
							id: 59,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 48',
							unitId: 48,
							id: 60,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 49',
							unitId: 49,
							id: 61,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 54',
							unitId: 54,
							id: 62,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 55',
							unitId: 55,
							id: 63,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 56',
							unitId: 56,
							id: 64,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 57',
							unitId: 57,
							id: 65,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 58',
							unitId: 58,
							id: 66,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 59',
							unitId: 59,
							id: 67,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 63',
							unitId: 63,
							id: 68,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 64',
							unitId: 64,
							id: 69,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 65',
							unitId: 65,
							id: 70,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 66',
							unitId: 66,
							id: 71,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 67',
							unitId: 67,
							id: 72,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 68',
							unitId: 68,
							id: 73,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 78',
							unitId: 78,
							id: 74,
							isLeaf: true,
							pid: 4,
							editNodeDisabled: true,
							delNodeDisabled: true
						}
					]
				},
				{
					name: 'Cluster 5',
					clusterId: 4,
					id: 5,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: [
						{
							name: 'Unit 60',
							unitId: 60,
							id: 75,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 61',
							unitId: 61,
							id: 76,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 70',
							unitId: 70,
							id: 77,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 71',
							unitId: 71,
							id: 78,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 72',
							unitId: 72,
							id: 79,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 80',
							unitId: 80,
							id: 80,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 81',
							unitId: 81,
							id: 81,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 82',
							unitId: 82,
							id: 82,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 90',
							unitId: 90,
							id: 83,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 91',
							unitId: 91,
							id: 84,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 92',
							unitId: 92,
							id: 85,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						}
					]
				},
				{
					name: 'Cluster 6',
					clusterId: 5,
					id: 6,
					pid: 0,
					dragDisabled: true,
					addTreeNodeDisabled: true,
					addLeafNodeDisabled: true,
					editNodeDisabled: false,
					delNodeDisabled: false,
					children: [
						{
							name: 'Unit 69',
							unitId: 69,
							id: 86,
							isLeaf: true,
							pid: 6,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 73',
							unitId: 73,
							id: 87,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 74',
							unitId: 74,
							id: 88,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 75',
							unitId: 75,
							id: 89,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 76',
							unitId: 76,
							id: 90,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 77',
							unitId: 77,
							id: 91,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 79',
							unitId: 79,
							id: 92,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 83',
							unitId: 83,
							id: 93,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 84',
							unitId: 84,
							id: 94,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 85',
							unitId: 85,
							id: 95,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 86',
							unitId: 86,
							id: 96,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 87',
							unitId: 87,
							id: 97,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 88',
							unitId: 88,
							id: 98,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 89',
							unitId: 89,
							id: 99,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 93',
							unitId: 93,
							id: 100,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 94',
							unitId: 94,
							id: 101,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 95',
							unitId: 95,
							id: 102,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 96',
							unitId: 96,
							id: 103,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 97',
							unitId: 97,
							id: 104,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 98',
							unitId: 98,
							id: 105,
							isLeaf: true,
							pid: 5,
							editNodeDisabled: true,
							delNodeDisabled: true
						},
						{
							name: 'Unit 99',
							unitId: 99,
							id: 106,
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
		async getClusterTreeData() {},
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
		changeClusterColor(clusterId) {
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
		changeUnitClusterId(node, src, target) {
			// bug is hear
			console.log(node)
			console.log(src)
			console.log(target)
		},

		// 将分类结构传递给后台保存
		saveClusterTreeList() {
			this.$message.success('保存成功！')
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
