import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import LessonsPage from './pages/LessonsPage.vue';
import HomePage from './pages/HomePage.vue';
import AboutPage from './pages/AboutPage.vue';
import ShoppingCartPage from './pages/ShoppingCartPage.vue';
import AccountPage from './pages/AccountPage.vue'; 

// Define Routes
// Maps the browser URL path to the specific Vue Component
const routes = [
  { path: '/', component: HomePage },
  { 
    path: '/lessons', 
    component: LessonsPage,
    // Allows passing search queries from the URL directly to props
    props: route => ({ searchQuery: route.query.search || "" }) 
  },
  { path: '/about', component: AboutPage },
  { path: '/cart', component: ShoppingCartPage }, // [Requirement: Shopping Cart Page]
  { path: '/account', component: AccountPage } 
];

// Create Router Instance 
const router = createRouter({
  // [Requirement: Deployment]
  history: createWebHashHistory(),
  routes
});

// Mount App
// Connects the Router to the App
createApp(App).use(router).mount('#app');