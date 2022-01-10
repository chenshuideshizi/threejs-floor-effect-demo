<template>
    <div class="threeModel">
        <div id="modelBox"></div>
    </div>
</template>

<script>
import borderData from './build_demo.json'
import createModel from './createModel'
export default {
    name: 'threeModel',
    mixins:[createModel],
    data() {
        return {
            borderData: borderData,
        }
    },
    mounted() {
        this.initContainer(borderData)
    }
}
</script>

<style scoped lang="scss">
.threeModel {
    width: 100%;
    height: 100%;
    #modelBox {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 1);
    }
}
</style>