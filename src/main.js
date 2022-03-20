import { createApp } from 'vue'
import App from './App.vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import '../../invoicefrontend/node_modules/bootstrap/dist/css/bootstrap.css'
import '../../invoicefrontend/node_modules/bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
//import JwPagination from 'jw-vue-pagination';
import VuePaginator from 'vuejs-paginator';
//import VCalendar from 'v-calendar';

createApp(App).use(router).use(VuePaginator).mount('#app')
