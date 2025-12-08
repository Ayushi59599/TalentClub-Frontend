import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import LessonsPage from './pages/LessonsPage.vue';
import HomePage from './pages/HomePage.vue';
import AboutPage from './pages/AboutPage.vue';
import ShoppingCartPage from './pages/ShoppingCartPage.vue';
import AccountPage from './pages/AccountPage.vue'; 

// Define Routes
const routes = [
  { path: '/', component: HomePage },
  { 
    path: '/lessons', 
    component: LessonsPage,
    props: route => ({ searchQuery: route.query.search || "" }) 
  },
  { path: '/about', component: AboutPage },
  { path: '/cart', component: ShoppingCartPage },
  { path: '/account', component: AccountPage } 
];
 
const router = createRouter({
  history: createWebHashHistory(),
  routes
});

createApp(App).use(router).mount('#app');