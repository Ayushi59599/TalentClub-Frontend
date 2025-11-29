<template>
  <nav class="navbar">
    <div class="navbar-brand" @click="$router.push('/')">TalentClub</div>

    <ul class="navbar-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/lessons">Lessons</router-link></li>
      <li><router-link to="/about">About</router-link></li>
      <li><router-link to="/account">Account</router-link></li>
    </ul>

    <ul class="navbar-links utility-links">
      <li 
        class="cart-icon" 
        :class="{ 'disabled': cartStore.items.length === 0 }" 
        @click="handleCartClick"
      >
        🛒 <span v-if="cartStore.items.length > 0" class="cart-count">{{ cartStore.items.length }}</span>
      </li>
    </ul>
  </nav>
</template>

<script>
// Imports the shared Cart Store so the Navbar stays in sync with the Buy Button
import { cartStore } from "../store/cart";

export default {
  data() {
    return { cartStore };
  },
  methods: {
    handleCartClick() {
      // [Requirement: Cart Button Logic]
      // If the cart is empty, do nothing
      if (this.cartStore.items.length === 0) return;

      // [Requirement: Cart Toggle]
      // If we are already on the Cart page, go back to Lessons else go to the Cart page.
      if (this.$route.path === '/cart') {
        this.$router.push('/lessons');
      } else {
        this.$router.push('/cart');
      }
    }
  }
};
</script>

<style scoped>
/* Navbar Container styling */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
  background: radial-gradient(circle at top left, #0f172a 0%, #1e293b 100%);
  font-family: 'Roboto', sans-serif;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  color: #f8fafc;
  transition: background 0.3s;
}

/* Brand/Logo styling */
.navbar-brand {
  font-weight: 700;
  font-size: 1.6rem;
  color: #e0e7ff;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
}

.navbar-brand:hover {
  transform: translateY(-2px);
  color: #c7d2fe;
}

/* Navigation Links List */
.navbar-links {
  list-style: none;
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 0;
  padding: 0;
}

/* Individual Link styling */
.navbar-links li a {
  text-decoration: none;
  color: #e0e7ff;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
}

.navbar-links li a:hover {
  background: rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

/* Cart icon styling */
.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 1.3rem;
  color: #e0e7ff;
  padding: 6px;
  border-radius: 8px;
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
}

.cart-icon:hover {
  background: rgba(59, 130, 246, 0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

/* The blue badge showing the number of items */
.cart-count {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #3b82f6;
  color: #fff;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 50%;
  font-weight: 600;
}

/* Responsive for smaller screens */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 10px;
  }
  .navbar-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>