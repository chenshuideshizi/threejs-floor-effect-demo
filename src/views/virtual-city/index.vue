<template>
    <div ref="wrapper"></div>
</template>

<script>
    import { createCity } from './city'
    import { initThree } from './initThree'
    export default {
        name: 'VirtualCity',
        mounted() {
            this.init()
        },
        methods: {
            init() {
                const {scene, renderer} = initThree()
                this.$refs.wrapper.appendChild(renderer.domElement)

                const city = createCity()
                scene.add(city)
            }
        }
    }
</script>

<style scoped>

</style>
