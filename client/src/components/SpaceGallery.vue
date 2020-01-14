<template>
    <!-- type:gallery画廊/carousel走马灯， control-pause:走马灯状态时是否显示暂停播放按钮
        dark:暗色主题，caption:画廊模式中是否展示图片描述  control-title:图片轮播或画廊全屏展示时受否显示图片描述 -->
	<v-gallery 
        :images="list" 
        type="carousel"
        :caption="true" 
        :control-pause="true">
    </v-gallery>
</template>

<script>
export default {
	data() {
		return {
            list: [
                {title: '1', url: require('./data/20160101.png')},
                {title: '2', url: require('./data/201601.png')},
                {title: '3', url: require('./data/20160101-b.png')}
            ]
        };
	},
	watch: {},
	methods: {},
	created() {},
	mounted() {},
    props: {},
    components: {
    }
};
</script>

<style scoped>
</style>