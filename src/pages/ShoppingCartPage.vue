<template>
  <div class="cart-page">
    <div class="container">

      <div class="cart-header">
        <button class="btn-back" @click="$router.push('/lessons')">
          ← Continue Shopping
        </button>
        <h1 class="page-title">Your Shopping Cart</h1>
      </div>

      <div class="cart-layout">

        <div class="cart-items-section">

          <div v-if="cartStore.items.length === 0" class="empty-cart">
            <div class="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any activities yet.</p>
            <button @click="$router.push('/lessons')" class="btn-primary">
              Browse Activities
            </button>
          </div>

          <div v-else class="items-list">
            <div 
              v-for="lesson in cartLessons" 
              :key="lesson._id" 
              class="cart-item"
            >
              <div class="item-img-wrapper">
                <img v-if="lesson.image" :src="lesson.image" class="cart-img"/>
              </div>

              <div class="item-details">
                <div class="item-info">
                  <span class="item-category">{{ lesson.topic }}</span>
                  <h3 class="item-title">{{ lesson.topic }} Class</h3>
                  <p class="item-location">📍 {{ lesson.location }}</p>
                </div>

                <div class="item-price-block">
                  <span class="price">£{{ lesson.price }}</span>
                  <button class="btn-remove" @click="cartStore.removeItem(lesson._id)">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-summary-section" v-if="cartStore.items.length > 0">
          <div class="summary-card">
            <h3>Order Summary</h3>

            <div class="summary-rows">
              <div class="summary-row">
                <span>Items ({{ cartStore.items.length }})</span>
                <span>£{{ totalAmount }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>£{{ totalAmount }}</span>
              </div>
            </div>

            <div class="checkout-form">
              <label>Checkout Details</label>

              <div class="input-group">
                <input v-model="checkoutName" type="text" placeholder="Full Name" class="input-field" />
              </div>
              <div class="input-group">
                <input v-model="checkoutPhone" type="tel" placeholder="Phone Number" class="input-field" />
              </div> 
              <div class="input-group">
                <input v-model="checkoutPassword" type="password" placeholder="Password" class="input-field" />
              </div>

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
import { cartStore } from "../store/cart";

export default {
  data() {
    return {
      lessons: [],
      checkoutName: "",
      checkoutPhone: "",
      checkoutPassword: "",
      isSubmitting: false,
      cartStore 
    };
  },

  computed: {
    cartLessons() {
      return this.lessons.filter(l => this.cartStore.items.includes(l._id));
    },

    totalAmount() {
      return this.cartLessons.reduce((sum, lesson) => sum + lesson.price, 0);
    },

    //Validation
    isCheckoutValid() {
      const nameValid = /^[A-Za-z\s-]+$/.test(this.checkoutName);
      const phoneValid = /^[0-9\s+]+$/.test(this.checkoutPhone);
      const passwordValid = this.checkoutPassword.length > 0;
      return nameValid && phoneValid && passwordValid && this.cartStore.items.length > 0;
    }
  },


  methods: { 
    
    async fetchLessons() {
      try {
        const res = await fetch("https://talentclub-backend.onrender.com/lessons");
        this.lessons = await res.json();
      } 
      catch (err) {
        console.error("Error loading lessons:", err);
      }
    },

    async placeOrder() {
      if (!this.isCheckoutValid) return;

      this.isSubmitting = true;

      try {
        const orderDetails = this.cartLessons.map(lesson => ({
            id: lesson._id,
            topic: lesson.topic,
            location: lesson.location,
            price: lesson.price,
            image: lesson.image
        }));

        //POST Order
        const resOrder = await fetch("https://talentclub-backend.onrender.com/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessons: orderDetails,
            name: this.checkoutName.trim(),
            phone: this.checkoutPhone.trim(),
            password: this.checkoutPassword.trim() 
          }),
        });

        const dataOrder = await resOrder.json();
        if (!resOrder.ok) throw new Error(dataOrder.message || "Order failed");

        //PUT Update Spaces
        for (const lesson of this.cartLessons) {
            const newSpace = lesson.spaces > 0 ? lesson.spaces - 1 : 0;
            await fetch(`https://talentclub-backend.onrender.com/lessons/${lesson._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ spaces: newSpace })
            });
        }

        alert("Order placed successfully! Spaces updated.");

        // Clear the global cart
        this.cartStore.clear();
        this.checkoutName = "";
        this.checkoutPhone = "";
        this.checkoutPassword = ""; 

        // Redirect to lessons page
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

  mounted() {
    this.fetchLessons();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

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
  width: 60px;
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
