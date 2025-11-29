<template>
  <div class="app">
    <NavBar @toggle-cart="toggleCart" />

    <main class="page-wrap">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';

export default {
  name: "App",
  components: { NavBar },
  methods: {
    toggleCart() {
      // If we are already on cart, go back to lessons
      if (this.$route.path === '/cart') {
        this.$router.push('/lessons');
      } else {
        this.$router.push('/cart');
      }
    }
  }
};
</script>

