import { createRouter,createWebHistory} from "vue-router"

// 路由信息
const routes = [
    {
        path:  '/',
        redirect: '/floor'
    },
    {
        path: "/index",
        name: "Index",
        component:  () => import('../views/index/index.vue'),
    },
    {
        path: "/test",
        name: "Test",
        component:  () => import('../views/test/index.vue'),
    },
    {
        path: "/floor",
        name: "Floor",
        component:  () => import('../views/floor/index.vue'),
    },
    {
        path: "/floor-demo",
        name: "FloorDemo",
        component:  () => import('../views/floor-demo/index.vue'),
    },
    {
        path: "/grid",
        name: "Grid",
        component:  () => import('../views/grid/index.vue'),
    },
    {
        path: '/virtual-city',
        name: 'VirtualCity',
        component:  () => import('../views/virtual-city/index.vue'),
    }
];

// 导出路由
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router