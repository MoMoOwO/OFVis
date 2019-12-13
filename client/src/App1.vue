<template>
	<div id="app">
		<el-container>
			<!-- 头部 -->
			<el-header height="4%">
				XC吃屎！
				<el-tooltip :content="isFullscreen ? '取消全屏' : '全屏'" placement="bottom" effect="light">
					<el-button icon="el-icon-full-screen" circle @click="handleFullScreen()"></el-button>
				</el-tooltip>
			</el-header>
			<!-- 主体 -->
			<el-main>
				<div style="height:100%;width:100%">
					<el-row :gutter="10">
						<el-col :span="8">
							<div class="grid-content bg-purple"></div>
							<br />
							<div class="grid-contentButtom bg-purple"></div>
						</el-col>
						<el-col :span="8">
							<div class="grid-contentHeight bg-purple">
								<mapchart class="map" style="margin-left:17px;"></mapchart>
								<mapchart class="map" style="margin-left:320px;"></mapchart>
							</div>
						</el-col>
						<el-col :span="8">
							<div class="grid-content bg-purple"></div>
							<br />
							<div class="grid-contentButtom bg-purple"></div>
						</el-col>
					</el-row>

					<el-row :gutter="10" id="elrowlast">
						<el-col :span="8">
							<div class="grid-content bg-purple"></div>
						</el-col>
						<el-col :span="8">
							<div class="grid-content bg-purple"></div>
						</el-col>
						<el-col :span="8">
							<div class="grid-content bg-purple"></div>
						</el-col>
					</el-row>
				</div>
			</el-main>

			<!-- 底部 -->
			<el-footer height="4%">版权所有©***</el-footer>
		</el-container>
	</div>
</template>

<script>
// 引入全屏插件
import screenfull from "screenfull";

import mapchart from "@/components/MapChart.vue";

export default {
	data() {
		return {
			isFullscreen: false // 标识是否全屏
		};
	},
	watch: {},
	methods: {
		handleFullScreen() {
			// 全屏和取消全屏
			if (!screenfull.enabled) {
				this.$notify.error({
					title: "提示",
					message: "该浏览器不支持全屏！",
					showClose: false
				});
			} else {
				screenfull.toggle(); // 开启全屏

				this.isFullscreen = true;
				// this.$notify.success({
				//   title: '提示',
				//   message: '按ESC即可退出全屏',
				//   showClose: false
				// });
			}
		},
		checkFull() {
			// 全屏下按下ESC关闭全屏
			let isFull =
				document.fullscreenEnabled ||
				window.fullScreen ||
				document.webkitIsFullScreen ||
				document.msFullscreenEnabled;
			if (isFull === undefined) {
				isFull = false;
			}
			return isFull;
		}
	},
	created() {},
	mounted() {
		// 在此时监控全屏下是否按下ESC键
		window.onresize = () => {
			if (!this.checkFull()) {
				// 全屏下按下ESC执行的操作
				this.isFullscreen = false;
			}
		};
	},
	components: {
		mapchart
	},
	props: {}
};
</script>

<style>
.map {
	height: 80%;
	width: 15%;
	position: absolute;
}

html,
body,
#app,
.el-container {
	padding: 0px;
	margin: 0px;
	height: 100%;
	line-height: 37px;
}

.el-header,
.el-footer {
	background-color: #b3c0d1;
	color: #333;
	text-align: center;
}

.el-main {
	background-color: #e9eef3;
	color: #333;
	text-align: center;
	line-height: 160px;
	padding: 5px;
}

.el-row {
	margin-bottom: 10px;
}

#elrowlast {
	margin-bottom: 0;
}
.el-col {
	border-radius: 4px;
}
.bg-purple-dark {
	background: #99a9bf;
}
.bg-purple {
	background: #d3dce6;
}
.bg-purple-light {
	background: #e5e9f2;
}
.grid-content {
	border-radius: 4px;
	min-height: 275px;
	min-width: 100px;
}
.grid-contentHeight {
	border-radius: 4px;
	min-height: 560px;
	min-width: 100px;
}
.grid-contentButtom {
	margin-top: 10px;
	border-radius: 4px;
	min-height: 275px;
	min-width: 100px;
}
.row-bg {
	padding: 10px 0;
	background-color: #f9fafc;
}
br {
	display: none;
}
</style>