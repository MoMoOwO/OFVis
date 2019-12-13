<template>
	<div id="app">

		<h3>{{data}}</h3>
		<calendar :datequery='2015'></calendar>

		<!-- <router-link to="/calendar">
      <input type="button" value="日历图" />
    </router-link>

    <transition mode="out-in">
      <router-view></router-view>
    </transition> -->

	</div>
</template>

<script>
import CalendarChart from "@/components/charts/Calendar.vue";

export default {
	data() {
		return {
			data: "你好",

			datequery: "2016"
		};
	},
	watch: {},
	methods: {},
	created() {},
	mounted() {},
	components: { calendar: CalendarChart },
	props: {}
};
</script>

<style>
#app {
	width: 100%;
	height: 100%;
}
/* routerview组件切换动画 */
/* .v-enter {
  opacity: 0;
  transform: translateX(100%);
}
.v-leave-to {
  opacity: 0;
  transform: translateX(-100%);
  position: absolute;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
} */
</style>