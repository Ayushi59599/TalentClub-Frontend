import { reactive } from 'vue';

// [Requirement: State Management]
// When data changes here, all components update automatically.
export const cartStore = reactive({
  // Load items from LocalStorage so the cart persists on page refresh
  items: JSON.parse(localStorage.getItem("cartItems") || "[]"),

  // Adds an item ID to the array
  addItem(lessonId) {
    if (!this.items.includes(lessonId)) {
      this.items.push(lessonId);
      this.save();
    }
  },

  // Removes an item ID from the array
  removeItem(lessonId) {
    this.items = this.items.filter(id => id !== lessonId);
    this.save();
  },

  // Helper to check if an ID exists in the cart
  contains(lessonId) {
    return this.items.includes(lessonId);
  },

  // Clears the entire cart used after checkout
  clear() {
    this.items = [];
    this.save();
  },

  // Saves the current state to the Browser's LocalStorage
  save() {
    localStorage.setItem("cartItems", JSON.stringify(this.items));
  }
});