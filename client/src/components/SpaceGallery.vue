<template>
	<v-gallery 
        :images="list" 
        :caption="true">
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