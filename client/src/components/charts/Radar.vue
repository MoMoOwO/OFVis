<template>
	<v-chart 
        ref="radar" 
        :options="radarOpt" 
        autoresize 
        @click="handleClick">
    </v-chart>
</template>

<script>
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/radar';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/radar';

export default {
	data() {
		return {
            radarOpt: {
                title: {
                    text: 'Area',
                    subtext: ''
                },
                tooltip: {
                    //雷达图的tooltip不会超出div，也可以设置position属性，position定位的tooltip 不会随着鼠标移动而位置变化，不友好
                    confine: true,
                    formatter: params => {
                        // 由于雷达图事逆时针排列，所以实际顺序事1月12月11月....
                        let info = `${params.name}: <br />${this.radarOpt.radar.indicator[0].text}: ${params.value[0].toFixed(2)}<br />`;
                        for (let i = params.value.length - 1; i > 0 ; i--){
                            info += `${this.radarOpt.radar.indicator[i].text}: ${params.value[i].toFixed(2)} km² <br />`;
                        }
                        return info;
					}
                },
                legend: {
                    orient: 'vertical',
                    data: [
                        { name: '2015', icon: 'circle', color: 'rgb(228, 26, 28)' },
                        { name: '2016', icon: 'circle', color: 'rgb(55, 126, 184)' },
                        { name: '2017', icon: 'circle', color: 'rgb(77, 175, 74)' }
                    ]
                },
                radar: {
                    // shape: 'circle',
                    name: {
                        textStyle: {
                            color: '#fff',
                            backgroundColor: '#999',
                            borderRadius: 3,
                            padding: [3, 5]
                        }
                    },
                    //triggerEvent: true, // 坐标轴标签响应和触发鼠标事件
                    indicator: [
                        { text: "Jan", max: 150,
                            axisLabel: {
                            show: true,
                            formatter: (params) => {
                                return `${params.toFixed(2)} km²`;
                            },
                            color: 'black'
                        }},
                        { text: "Dec", max: 150 },
                        { text: "Nov", max: 150 },
                        { text: "Oct", max: 150 },
                        { text: "Sep", max: 150 },
                        { text: "Aug", max: 150 },
                        { text: "Jul", max: 150 },
                        { text: "Jun", max: 150 },
                        { text: "May", max: 150 },
                        { text: "Apr", max: 150 },
                        { text: "Mar", max: 150 },
                        { text: "Feb", max: 150 }
                    ]
                },
                series: [{
                    name: 'Area',
                    type: 'radar',
                    symbol: 'circle', // 拐点的样式，还可以取值'rect','angle'等
                    symbolSize: 8, // 拐点的大小
                    itemStyle: {
                        emphasis: {
                            // color: 各异,
                            lineStyle: {
                                width: 4
                            }
                        }
                    },
                    // areaStyle: {normal: {}},
                    data : null
                }]
            }
        };
	},
	watch: {},
	methods: {
        getData(areaid = 0){
            this.axios
                .post(`data/radar?areaid=${areaid}`)
                .then(result => {
                    if (result.data.status === 0) {
                        let dataShow = result.data.message.data;
                        let max = dataShow[0].value[0]; // 获取面积最大值
                        for (let i = 0; i < dataShow.length; i++){
                            for(let j = 0; j < dataShow[i].value.length; j++){
                                max = max > dataShow[i].value[j] ? max : dataShow[i].value[j];
                            }
                        }
                        // 更新指示器的最大值
                        this.radarOpt.radar.indicator.forEach(item => {
                            item.max = max;
                        })
						// 更新数据
                        this.radarOpt.series[0].data = dataShow;
						// 隐藏缓冲条
						this.$refs.radar.hideLoading();
					} else {
						// 失败请求数据的回调
						this.$notify.error({
							title: "Error",
							message: "Failed get Calendar-data!"
						});
					}
                });
        },
        handleClick(e){
            // 点击拐点的索引
            let index = e.event.target.__dimIdx;
            // subtext显示三个年份该月的面积
            let info = this.radarOpt.radar.indicator[index].text + ': ';
            let dataArr = this.radarOpt.series[0].data;
            for (let i = 0; i < dataArr.length; i++){
                info += `${dataArr[i].name}: ${dataArr[i].value[index].toFixed(2)} km²  `;
            }
            this.radarOpt.title.subtext = info;

            // 更新地图显示日期
            let month = this.radarOpt.radar.indicator[index].text;
            switch (month) {
                case "Jan":
                    month = '01';
                    break;
                case "Feb":
                    month = "02";
                    break;
                case "Mar":
                    month = "03";
                    break;
                case "Apr":
                    month = '04';
                    break;
                case "May":
                    month = "05";
                    break;
                case "Jun":
                    month = "06";
                    break;
                case "Jul":
                    month = '07';
                    break;
                case "Aug":
                    month = "08";
                    break;
                case "Sep":
                    month = "09";
                    break;
                case "Oct":
                    month = '10';
                    break;
                case "Nov":
                    month = "11";
                    break;
                case "Dec":
                    month = "12";
                    break;
                default:
                    month = "01";
                    break;
            }
            // 通过调用父组件的方法给父组件传值(修改data中的值)
			this.$emit('changeDateInMap', +(e.name + month));
        }
    },
	created() {},
    mounted() {
        // 显示缓冲条
		this.$refs.radar.showLoading({
			text: 'Loading…',
			color: '#F03B20',
			maskColor: 'rgba(255, 255, 255, 0.4)'
		});
		// 获取数据
		this.getData();
    },
    components:{
        'v-chart': ECharts
    },
	props: {}
};
</script>

<style scoped>
.echarts {
	width: 100%;
	height: 100%;
}
</style>