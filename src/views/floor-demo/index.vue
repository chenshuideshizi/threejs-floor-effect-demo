<template>
    <div class="threeModel">
        <div id="modelBox"></div>
    </div>
</template>

<script>
import borderData from './build.json'
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
        this.initContainer(this.borderData)
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
        background: rgba(0, 0, 0, 0.5);
    }
}
</style>