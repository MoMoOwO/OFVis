<template>
	<v-chart
        ref="box" 
        autoresize
        :options="boxOpt">
    </v-chart>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/boxplot';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';

export default {
	data() {
		return {
            date: '20150101',
            boxOpt: {
                title: [
                    {
                        text: 'Stranger',
                        left: 'center',
                    },
                    {
                        text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
                        borderColor: '#999',
                        borderWidth: 1,
                        textStyle: {
                            fontSize: 14
                        },
                        left: '10%',
                        top: '90%'
                    }
                ],
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: null,
                    boundaryGap: true,
                    nameGap: 30,
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0, // 间隔0，全部显示
                        rotate: 45, // 旋转45°防止遮挡
                        formatter: 'Area {value}'
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '℃/km',
                    splitArea: {
                        show: true
                    }
                },
                series: [
                    {
                        name: 'boxplot',
                        type: 'boxplot',
                        data: null,
                        tooltip: {
                            formatter: function (param) {
                                return [
                                    'Experiment ' + param.name + ': ',
                                    'upper: ' + param.data[5],
                                    'Q3: ' + param.data[4],
                                    'median: ' + param.data[3],
                                    'Q1: ' + param.data[2],
                                    'lower: ' + param.data[1]
                                ].join('<br/>');
                            }
                        }
                    },
                    {
                        name: 'outlier',
                        type: 'scatter',
                        data: null
                    }
                ]
            }
        };
	},
	watch: {},
	methods: {
        getData(){
            this.axios
                .post(`data/box?date=${this.date}`)
                .then( result => {
                    if (result.data.status === 0) {
                        let dataShow = result.data.message;
                        this.boxOpt.xAxis.data = dataShow.axisData;
                        this.boxOpt.series[0].data = dataShow.boxData;
                        this.boxOpt.series[1].data = dataShow.outliers;
						// 隐藏缓冲条
						this.$refs.box.hideLoading();
					} else {
						// 失败请求数据的回调
						this.$notify.error({
							title: "Error",
							message: "Failed get Calendar-data!"
						});
					}
                });
        },
        quantile(arr, per){
            let i = (arr.length - 1) * per + 1, n = Math.floor(i), a = +arr[n - 1], o = i - n;
            return o ? a + o * (arr[n] - a) : a;
        },
        prepareBoxPlotData(rawData, opt){
            opt = opt || [];
            let boxData = []; // 箱图中的数据
            let outliers = []; // 离群值
            let axisData = []; // 坐标轴的值
            let boundIQR = opt.boundIQR; // 获取 boundIQR
            let useExtreme = boundIQR === 'none' || boundIQR === 0; // 是否使用界限

            for (let i = 0; i < rawData.length; i++) {
                axisData.push(i + ''); // 坐标轴序号
                let ascList = rawData[i].sort((a, b) => a - b ); // 获取升序序数组

                // 下四分位数
                let Q1 = this.quantile(ascList, 0.25);
                // 中位数
                let Q2 = this.quantile(ascList, 0.5);
                // 上四分位数
                let Q3 = this.quantile(ascList, 0.75); 
                let min = ascList[0]; // 最小值
                let max = ascList[ascList.length - 1]; // 最大值

                let bound = (boundIQR == null ? 1.5 : boundIQR) * (Q3 - Q1); // 设定的边界范围差

                // 下边缘
                let low = useExtreme
                    ? min
                    : Math.max(min, Q1 - bound);
                // 上边缘
                let high = useExtreme
                    ? max
                    : Math.min(max, Q3 + bound);

                boxData.push([low, Q1, Q2, Q3, high]); // 箱线图数据

                // 异常值数据
                for (let j = 0; j < ascList.length; j++) {
                    let dataItem = ascList[j];
                    if (dataItem < low || dataItem > high) {
                        let outlier = [i, dataItem];
                        opt.layout === 'vertical' && outlier.reverse();
                        outliers.push(outlier);
                    }
                }
            }
            return {
                boxData: boxData,
                outliers: outliers,
                axisData: axisData
            };
        }
    },
	created() {},
	mounted() {
        // 显示缓冲条
		this.$refs.box.showLoading({
			text: 'Loading…',
			color: '#409EFF',
			maskColor: 'rgba(255, 255, 255, 0.4)'
		});
        this.getData();
    },
    props: {},
    components: {
        'v-chart': ECharts
    }
};
</script>

<style scoped>
.echarts {
	width: 100%;
	height: 100%;
}
</style>