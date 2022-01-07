import { createRouter,createWebHistory} from "vue-router"

// 路由信息
const routes = [
    {
        path:  '/',
        redirect: '/index'
    },
    {
        path: "/index",
        name: "Index",
        component:  () => import('../views/index/index.vue'),
    },
    {
        path: "/test",
        name: "test",
        component:  () => import('../views/test/index.vue'),
    },
];

// 导出路由
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router