<template>
  <div class="cart-page">

    <!-- ===================== PAGE CONTAINER ===================== -->
    <div class="container">

      <!-- ===================== HEADER ===================== -->
      <div class="cart-header">
        <!-- Button takes user back to lesson listings -->
        <button class="btn-back" @click="$router.push('/lessons')">
          ← Continue Shopping
        </button>

        <h1 class="page-title">Your Shopping Cart</h1>
      </div>

      <!-- ===================== MAIN LAYOUT (ITEMS + SUMMARY) ===================== -->
      <div class="cart-layout">

        <!-- ===================== LEFT SIDE: CART ITEMS ===================== -->
        <div class="cart-items-section">

          <!-- If the cart is empty -->
          <div v-if="cartLessons.length === 0" class="empty-cart">
            <div class="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any activities yet.</p>

            <!-- Send user back to lessons -->
            <button @click="$router.push('/lessons')" class="btn-primary">
              Browse Activities
            </button>
          </div>

          <!-- If cart has items -->
          <div v-else class="items-list">

            <!-- Loop through all items by filtering lessons using saved cart IDs -->
            <div 
              v-for="lesson in cartLessons" 
              :key="lesson._id" 
              class="cart-item"
            >

              <!-- Activity Image -->
              <div class="item-img-wrapper">
                <img 
                  v-if="lesson.image" 
                  :src="lesson.image" 
                  alt="Activity" 
                  class="cart-img"
                />
              </div>

              <!-- Activity Details (Name, Location, Price, Remove Button) -->
              <div class="item-details">

                <div class="item-info">
                  <span class="item-category">{{ lesson.topic }}</span>
                  <h3 class="item-title">{{ lesson.topic }} Class</h3>
                  <p class="item-location">📍 {{ lesson.location }}</p>
                </div>

                <div class="item-price-block">
                  <span class="price">£{{ lesson.price }}</span>

                  <!-- Remove item from cart -->
                  <button 
                    class="btn-remove" 
                    @click="removeFromCart(lesson)" 
                    title="Remove item"
                  >
                    <!-- Small trash bin icon -->
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2"
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path 
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4
                        a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                      ></path>
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- ===================== RIGHT SIDE: SUMMARY CARD ===================== -->
        <div class="cart-summary-section" v-if="cartLessons.length > 0">

          <div class="summary-card">
            <h3>Order Summary</h3>

            <!-- Subtotal + Total -->
            <div class="summary-rows">
              <div class="summary-row">
                <span>Items ({{ totalItems }})</span>
                <span>£{{ totalAmount }}</span>
              </div>

              <div class="summary-row total">
                <span>Total</span>
                <span>£{{ totalAmount }}</span>
              </div>
            </div>

            <!-- ===================== CHECKOUT FORM ===================== -->
            <div class="checkout-form">
              <label>Checkout Details</label>

              <!-- Full Name -->
              <div class="input-group">
                <input 
                  v-model="checkoutName" 
                  type="text"
                  placeholder="Full Name"
                  class="input-field"
                />
              </div>
 
              <!-- Phone -->
              <div class="input-group">
                <input 
                  v-model="checkoutPhone" 
                  type="tel"
                  placeholder="Phone Number"
                  class="input-field"
                />
              </div>

              <!-- Checkout Button -->
              <button
                class="btn-checkout"
                @click="placeOrder"
                :disabled="!isCheckoutValid || isSubmitting"
              >
                <span v-if="isSubmitting">Processing...</span>
                <span v-else>Complete Checkout</span>
              </button>
              <p class="secure-text">🔒 Secure Checkout</p>
            </div>

          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      lessons: [],        
      cartItems: [],      
      checkoutName: "",   
      checkoutPhone: "",  
      isSubmitting: false 
    };
  },

  computed: {
    // Converts ID list to actual lesson objects
    cartLessons() {
      return this.lessons.filter(l => this.cartItems.includes(l._id));
    },

    // How many items in cart
    totalItems() {
      return this.cartLessons.length;
    },

    // Total price
    totalAmount() {
      return this.cartLessons.reduce((sum, lesson) => sum + lesson.price, 0);
    },

    // Validates name + phone 
    isCheckoutValid() {
      const nameValid = /^[A-Za-z\s-]+$/.test(this.checkoutName);
      const phoneValid = /^[0-9\s+]+$/.test(this.checkoutPhone);

      return nameValid && phoneValid && this.cartLessons.length > 0;
    }
  },

  methods: {
    // ===================== FETCH ALL LESSONS =====================
    async fetchLessons() {
      try {
        const res = await fetch("http://localhost:8000/lessons");
        const data = await res.json();

        this.lessons = data;

        // Load cart from localStorage (persistent cart)
        const saved = JSON.parse(localStorage.getItem("cartItems") || "[]");

        // Ensure IDs actually exist in backend
        this.cartItems = saved.filter(id => this.lessons.some(l => l._id === id));
      } 
      catch (err) {
        console.error("Error loading lessons:", err);
      }
    },

    // ===================== REMOVE ITEM =====================
    removeFromCart(lesson) {
      // Filter out the removed lesson ID
      this.cartItems = this.cartItems.filter(id => id !== lesson._id);

      // Save updated cart
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
    },

    // ===================== PLACE ORDER =====================
    async placeOrder() {
      if (!this.isCheckoutValid) return;

      this.isSubmitting = true; // Loading state

      try {
        // Send order to backend
        const res = await fetch("http://localhost:8000/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessons: this.cartItems.map(id => ({ lesson_id: id })),
            name: this.checkoutName.trim(),
            phone: this.checkoutPhone.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Order failed");

        alert("Order placed successfully! 🎉");

        // Reset everything
        this.cartItems = [];
        localStorage.removeItem("cartItems");
        this.checkoutName = "";
        this.checkoutPhone = "";

        // Go back to lessons page
        this.$router.push("/lessons");
      } 
      catch (err) {
        alert("Failed to place order: " + err.message);
      } 
      finally {
        this.isSubmitting = false;
      }
    }
  },

  // Runs when page loads
  mounted() {
    this.fetchLessons();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Base styles */
* { 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif; 
}

/* Main Page */
.cart-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: #ffffff;
  color: #111827; /* Dark text */
}

.container { 
  max-width: 1100px;
  margin: 0 auto; 
}

/* Header */
.cart-header { 
  margin-bottom: 2rem; 
}

.btn-back {
  background: none;
  border: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
  transition: color 0.2s;
}

.btn-back:hover { 
  color: #F97316; 
}

.page-title { 
  font-size: 2rem; 
  font-weight: 800; 
  margin: 0; 
}

/* Layout */

.cart-layout {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
}

/* Left Column */
.cart-items-section { 
  flex: 2; 
}

/* Right Column */
.cart-summary-section { 
  flex: 1;
  min-width: 320px;
  position: sticky;
  top: 2rem;
}

/* Empty Cart */

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: #f9fafb;
  border-radius: 16px;
  border: 2px dashed #e5e7eb;
}

.empty-icon { 
  font-size: 3rem; 
  margin-bottom: 1rem; 
}

.empty-cart h3 { 
  margin-bottom: 0.5rem; 
}

.empty-cart p { 
  color: #6b7280; 
  margin-bottom: 1.5rem; 
}

.btn-primary {
  background: #F97316; 
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

/* Cart Item */

.cart-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  transition: box-shadow 0.2s;
}

.cart-item:hover { 
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05); 
}

.item-img-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;
}

.cart-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

.item-details { 
  flex: 1;
  display: flex;
  justify-content: space-between; 
}

.item-info { 
  display: flex; 
  flex-direction: column; 
  gap: 4px; 
}

.item-category {
  font-size: 0.8rem;
  color: #F97316; 
  font-weight: 600;
  text-transform: uppercase;
}

.item-title { 
  margin: 0; 
  font-size: 1.1rem; 
  font-weight: 700; 
}

.item-location { 
  color: #6b7280; 
  font-size: 0.9rem; 
  margin: 0; 
}

.item-price-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
}

.btn-remove {
  background: #fee2e2; 
  color: #ef4444;     
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #ef4444;
  color: white;
}

/* Summary Card */

.summary-card {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.summary-card h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.summary-rows {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  color: #6b7280;
}

.summary-row.total { 
  color: #111827;
  font-weight: 800;
  font-size: 1.2rem;
  margin-top: 1rem;
  margin-bottom: 0;
}

/* Checkout Form */

.checkout-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
}

.input-group { 
  margin-bottom: 1rem; 
}

.input-field {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: border 0.2s;
}

.input-field:focus { 
  border-color: #F97316; 
}

.btn-checkout {
  width: 100%;
  background: #111827;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-checkout:hover {
  background: #000;
  transform: translateY(-2px);
}

.btn-checkout:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.secure-text {
  text-align: center;
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 1rem;
}

/* Responsive */

@media (max-width: 768px) {
  .cart-layout { 
    flex-direction: column; 
    gap: 2rem; 
  }

  .cart-summary-section { 
    width: 100%; 
    position: static; 
  }

  .cart-item { 
    flex-direction: column; 
  }

  .item-img-wrapper { 
    width: 100%; 
    height: 150px; 
  }

  .item-details { 
    flex-direction: row; 
    align-items: flex-start; 
  }
}
</style>
