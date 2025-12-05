<template>
  <div class="account-page">
    <div class="container">

      <div v-if="!userStore.token" class="auth-view">
        <div class="auth-card">
          <div class="icon-circle">🔐</div>
          <h1 class="auth-title">Welcome Back</h1>
          <p class="auth-subtitle">Log in to view your bookings.</p>

          <div v-if="errorMsg" class="error-alert">{{ errorMsg }}</div>

          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="form.name" type="text" placeholder="John Doe" class="input-field" required />
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="form.phone" type="tel" placeholder="07123456789" class="input-field" required />
            </div>

            <div class="form-group">
              <label>Password</label>
              <input v-model="form.password" type="password" placeholder="••••••••" class="input-field" required />
            </div>

            <button type="submit" class="btn-primary full-width" :disabled="loading">
              <span v-if="loading">Processing...</span>
              <span v-else>Log In</span>
            </button>
          </form>
        </div>
      </div>

      <div v-else class="dashboard-view">
        <div class="dashboard-header">
          <div class="user-welcome">
            <h1>Hello, {{ userStore.user?.name || 'Student' }} 👋</h1>
            <p class="user-phone">{{ userStore.user?.phone }}</p>
          </div>
          <button class="btn-outline" @click="handleLogout">Log Out</button>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-label">Total Orders</span>
            <span class="stat-value">{{ myOrders.length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Classes Booked</span>
            <span class="stat-value">{{ totalClassesBooked }}</span>
          </div>
        </div>

        <div class="orders-section">
          <h2 class="section-title">Your Order History</h2>

          <div v-if="loadingOrders" class="loading-state">
            <div class="spinner"></div>
            <p>Syncing your history...</p>
          </div>

          <div v-else-if="myOrders.length === 0" class="empty-state">
            <div class="empty-icon">📂</div>
            <h3>No orders found</h3>
            <p>We couldn't find bookings for <strong>{{ userStore.user?.phone }}</strong>.</p>
            <button @click="$router.push('/lessons')" class="btn-primary">Browse Classes</button>
          </div>

          <div v-else class="orders-grid">
            <div v-for="(order, index) in myOrders" :key="index" class="order-card">
              <div class="order-header">
                <span class="order-id">Order #{{ index + 1 }}</span>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              </div>

            <div class="order-items">
  
                <div v-for="(lesson, idx) in order.lessons" :key="idx" class="order-item-row">
                    
                    <img v-if="lesson.image" :src="lesson.image" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover; margin-right: 10px;">
                    
                    <div class="item-info">
                    <h4>{{ lesson.topic }}</h4>
                    <p>📍 {{ lesson.location }} | £{{ lesson.price }}</p>
                    </div>
                </div>
                </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>
// Imports the Global Store to manage User Login State
import { userStore } from "../store/user";

export default {
  data() {
    return {
      userStore,
      loading: false,
      loadingOrders: false,
      errorMsg: "",
      form: { name: "", phone: "", password: "" },
      orders: [] 
    };
  },
  computed: {
    // Filters the big list of orders to find only those belonging to the current user
    myOrders() {
      if (!this.userStore.user?.phone) return [];
      
      // Remove spaces from phone number for accurate matching
      const phone = this.userStore.user.phone.replace(/\s/g, '');
      
      // Find the user object in the downloaded data
      const user = this.orders.find(u => u.phone && u.phone.replace(/\s/g, '') === phone);
      return user?.orders || [];
    },
    // Calculates total classes booked by summing up lessons in every order
    totalClassesBooked() {
      return this.myOrders.reduce((total, order) => total + (order.lessons?.length || 0), 0);
    }
  },
  mounted() {
    // If the user is already logged in, load their dashboard data immediately
    if (this.userStore.token) this.fetchDashboardData();
  },
  methods: {
    // Handles the login logic
    async handleLogin() {
      this.loading = true;
      this.errorMsg = "";

      try {
        // Fetch all users from the backend
        const res = await fetch("https://talentclub-backend.onrender.com/orders");
        const allUsers = await res.json();

        // Check if the entered credentials match a user in the database
        const user = allUsers.find(
             u => u.name.toLowerCase() === this.form.name.trim().toLowerCase() &&
               u.phone.replace(/\s/g, '') === this.form.phone.replace(/\s/g, '') &&
               u.password === this.form.password
        );

        if (!user) throw new Error("Invalid name, phone, or password");

        // Login successful: Save user to Global Store
        this.userStore.login({ name: user.name, phone: user.phone }, "mock-token-123");
        this.fetchDashboardData();

      } catch (err) {
        this.errorMsg = err.message || "Something went wrong.";
      } finally {
        this.loading = false;
      }
    },

    // Logs the user out
    handleLogout() {
      // Clear the login state in the global store
      this.userStore.clearUser();
      
      // Reset the input form
      this.form = { name: "", phone: "", password: "" };

      
    },

    // Gets the latest data from the MongoDB backend
    async fetchDashboardData() {
      this.loadingOrders = true;
      try {
        const res = await fetch("https://talentclub-backend.onrender.com/orders");
        this.orders = await res.json();
      } catch (err) {
        console.error(err);
      } finally {
        this.loadingOrders = false;
      }
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    }
  }
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Base page formatting */
* { 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif; 
}

.account-page { 
  min-height: 100vh; 
  background: #f8fafc; 
  color: #1e293b; 
  padding: 2rem 1rem; 
}

.container { 
  max-width: 800px; 
  margin: 0 auto; 
}

/* Auth View (Login) centering */
.auth-view { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  min-height: 60vh; 
}

/* Login card styling */
.auth-card {
  background: white; 
  padding: 2.5rem; 
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.06); 
  width: 100%; 
  max-width: 420px;
  border: 1px solid #e2e8f0; 
  text-align: center;
}

/* Icon above login title */
.icon-circle {
  width: 50px; 
  height: 50px; 
  background: #ffedd5; 
  border-radius: 50%;
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 1.5rem; 
  margin: 0 auto 1rem auto;
}

.auth-title { 
  font-size: 1.6rem; 
  font-weight: 800; 
  margin-bottom: 0.5rem; 
  color: #0f172a; 
}

.auth-subtitle { 
  color: #64748b; 
  margin-bottom: 1.5rem; 
  font-size: 0.9rem; 
}

/* Error alert box */
.error-alert { 
  background: #fee2e2; 
  color: #b91c1c; 
  padding: 0.8rem; 
  border-radius: 8px; 
  font-size: 0.9rem; 
  margin-bottom: 1rem; 
}

/* Form inputs */
.form-group { 
  text-align: left; 
  margin-bottom: 1rem; 
}

.form-group label { 
  display: block; 
  font-weight: 600; 
  margin-bottom: 0.4rem; 
  font-size: 0.85rem; 
  color: #334155; 
}

.input-field {
  width: 100%; 
  padding: 0.8rem; 
  border-radius: 10px; 
  border: 1px solid #cbd5e1;
  font-size: 0.95rem; 
  outline: none; 
  transition: 0.2s;
}

.input-field:focus { 
  border-color: #ea580c; 
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1); 
}

/* Primary Button */
.btn-primary {
  background: #ea580c; 
  color: white; 
  border: none; 
  padding: 0.9rem;
  border-radius: 10px; 
  font-weight: 600; 
  font-size: 1rem; 
  cursor: pointer;
  transition: background 0.2s; 
  margin-top: 0.5rem;
}

.btn-primary.full-width { 
  width: 100%; 
}

.btn-primary:hover { 
  background: #c2410c; 
}

.btn-primary:disabled { 
  background: #94a3b8; 
  cursor: not-allowed; 
}

.toggle-text { 
  margin-top: 1.5rem; 
  font-size: 0.9rem; 
  color: #64748b; 
}

.toggle-text a { 
  color: #ea580c; 
  font-weight: 600; 
  cursor: pointer; 
  text-decoration: underline; 
}

/* Dashboard Header */
.dashboard-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 2rem; 
  border-bottom: 1px solid #e2e8f0; 
  padding-bottom: 1.5rem; 
}

.user-welcome h1 { 
  font-size: 1.8rem; 
  font-weight: 800; 
  margin: 0; 
  color: #0f172a; 
}

.user-email { 
  color: #64748b; 
  margin-top: 4px; 
}

.btn-outline { 
  border: 1px solid #cbd5e1; 
  background: white; 
  padding: 0.5rem 1rem; 
  border-radius: 8px; 
  cursor: pointer; 
}

.btn-outline:hover { 
  color: #ea580c; 
  border-color: #ea580c; 
}

/* Stats Row Layout */
.stats-row { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 1rem; 
  margin-bottom: 2rem; 
}

.stat-card { 
  background: white; 
  padding: 1.5rem; 
  border-radius: 16px; 
  border: 1px solid #e2e8f0; 
  text-align: center; 
}

.stat-value { 
  display: block; 
  font-size: 2rem; 
  font-weight: 800; 
  color: #ea580c; 
}

.stat-label { 
  font-size: 0.85rem; 
  color: #64748b; 
  text-transform: uppercase; 
  font-weight: 600; 
}

/* Orders List */
.orders-grid { 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
}

.order-card { 
  background: white; 
  border-radius: 12px; 
  border: 1px solid #e2e8f0; 
  padding: 1.2rem; 
}

.order-header { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 1rem; 
  font-weight: 700; 
}

.order-item-row { 
  display: flex; 
  justify-content: space-between; 
  padding: 0.5rem 0; 
  border-bottom: 1px solid #f1f5f9; 
}

.order-item-row:last-child { 
  border-bottom: none; 
}

.item-info h4 { 
  margin: 0; 
  font-size: 0.95rem; 
}

.item-info p { 
  margin: 0; 
  font-size: 0.8rem; 
  color: #94a3b8; 
}

.order-footer { 
  margin-top: 1rem; 
  display: flex; 
  justify-content: space-between; 
  font-weight: 700; 
  color: #ea580c; 
}

/* Loading Spinner */
.spinner { 
  border: 3px solid #f3f3f3; 
  border-top: 3px solid #ea580c; 
  border-radius: 50%; 
  width: 24px; 
  height: 24px; 
  animation: spin 1s linear infinite; 
  margin: 0 auto 10px auto; 
}

@keyframes spin { 
  0% { transform: rotate(0deg); } 
  100% { transform: rotate(360deg); } 
}
</style>