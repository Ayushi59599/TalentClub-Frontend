<template>
  <div class="lessons-page main-page-wrap">

    <div class="container">

      <div class="header-section">
        <h1 class="page-title">All Activities</h1>
        <p class="page-subtitle">Browse our complete collection of after-school programs</p>

        <div class="search-wrapper">
          <span class="search-icon">🔍</span>
          <input
            class="search-input"
            type="text"
            placeholder="Search activities..."
            v-model="searchQuery"
          />
        </div>
      </div>

      <div class="category-filters">
        <p class="filter-label">Filter by Category</p>

        <div class="boxs-row">

          <button 
            :class="['cat-box', selectedTopic === '' ? 'active' : '']"
            @click="selectTopic('')"
          >
            All Activities
          </button>

          <button
            v-for="t in uniqueTopics"
            :key="t"
            :class="['cat-box', selectedTopic === t ? 'active' : '']"
            @click="selectTopic(t)"
          >
            <span v-if="t === 'Music'">🎵</span>
            <span v-else-if="t === 'Art'">🎨</span>
            <span v-else-if="t === 'Photography'">📸</span>
            <span v-else-if="t === 'Chemistry'">🔬</span>
            <span v-else-if="t === 'Astronomy'">🌌</span>
            <span v-else-if="t === 'Computer Science'">💻</span>
            <span v-else-if="t === 'Language'">🗣️</span>
            <span v-else-if="t === 'Biology'">🧬</span>
            <span v-else-if="t === 'Physics'">⚛️</span>
            <span v-else-if="t === 'Maths'">➗</span>
            <span v-else>✨</span> {{ t }}
          </button>

        </div>
      </div>

      <div class="secondary-filters">

        <div class="filter-group">

          <select v-model="selectedLocation" @change="clearSearch()">
            <option value="">📍 All Locations</option>
            <option v-for="l in uniqueLocations" :key="l" :value="l">
              {{ l }}
            </option>
          </select>

          <div class="price-filter">
            <label>Max: £{{ maxPrice }}</label>
            <input
              type="range"
              class="price-range"
              :min="0"
              :max="maxPriceAvailable"
              v-model="maxPrice"
            />
          </div>
        </div>

        <div class="sort-group">
          <span class="sort-label">Sort by:</span>

          <select v-model="sortKey" @change="sortAsc = true" class="sort-select">
            <option value="">Default</option>
            <option value="price">Price</option>
            <option value="location">Location</option>
            <option value="spaces">Spaces</option>
            <option value="topic">Topic</option>
          </select>

          <button 
            v-if="sortKey"
            class="sort-dir-btn"
            @click="sortAsc = !sortAsc"
          >
            {{ sortAsc ? '↑' : '↓' }}
          </button>
        </div>
      </div>

      <div class="cart-bar" v-if="cartStore.items.length > 0">
        <span>{{ cartStore.items.length }} items in cart</span>
        <button class="btn-view-cart" @click="$router.push('/cart')">
          View Cart
        </button>
      </div>

      <p class="results-count">
        Showing {{ filteredLessons.length }} activities
      </p>

      <div class="lessons-grid">

        <div
          v-for="lesson in filteredLessons"
          :key="lesson._id"
          class="lesson-card"
        >

          <div class="card-image-wrapper">
            <img v-if="lesson.image" :src="lesson.image" class="lesson-img"/>
            <div v-else class="lesson-img placeholder"></div>

            <span class="topic-tag">{{ lesson.topic }}</span>
          </div>

          <div class="card-content">

            <div class="card-header">
              <h3 class="lesson-title">{{ lesson.topic }}</h3>
              <span class="age-badge">Ages 6-12</span>
            </div>

            <p class="lesson-loc">📍 {{ lesson.location }}</p>

            <div class="spots-row">
              <span class="user-icon">👤</span>
              <span :class="{'text-red': getSpaces(lesson) < 3}">
                {{ getSpaces(lesson) }} spots left
              </span>
            </div>

            <div class="card-footer">

              <div class="price-block">
                <span class="curr-price">£{{ lesson.price }}</span>
                <span class="duration">/ term</span>
              </div>

              <div class="action-buttons">

                <button
                  class="btn-primary"
                  :disabled="getSpaces(lesson) === 0 && !cartStore.contains(lesson._id)"
                  @click="toggleCart(lesson)"
                >
                  {{ getCartButtonLabel(lesson) }}
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
// Imports the shared reactive store for Cart logic
import { cartStore } from "../store/cart";

export default {
  data() {
    return {
      lessons: [],          
      searchQuery: "",      
      selectedTopic: "",    
      selectedLocation: "", 
      maxPrice: 100,        
      maxPriceAvailable: 100, 
      sortKey: "",         
      sortAsc: true,
      cartStore // Makes the global store available 
    };
  },

  computed: {
    // Generates a list of unique Topics for the filter buttons
    uniqueTopics() {
      return [...new Set(this.lessons.map(l => l.topic))];
    },

    // Generates a list of unique Locations for the dropdown
    uniqueLocations() {
      return [...new Set(this.lessons.map(l => l.location))];
    },

    // [Requirement: Sorting & Filtering]
    // Handles filtering by Topic, Location, Price AND Sorting by Key
    filteredLessons() {
      // Filtering Logic
      let list = this.lessons.filter(l => {
        return (
          (!this.selectedTopic || l.topic === this.selectedTopic) &&
          (!this.selectedLocation || l.location === this.selectedLocation) &&
          l.price <= this.maxPrice
        );
      });

      // Sorting Logic
      if (!this.sortKey) return list;

      return list.slice().sort((a, b) => {
        let A = a[this.sortKey], B = b[this.sortKey];
        // Ensure case-insensitive sorting for strings
        if (typeof A === "string") A = A.toLowerCase();
        if (typeof B === "string") B = B.toLowerCase();

        // Returns -1 or 1 to determine order (Ascending/Descending)
        if (A < B) return this.sortAsc ? -1 : 1;
        if (A > B) return this.sortAsc ? 1 : -1;
        return 0;
      });
    }
  },

  watch: {
    // [Requirement: Search as you type]
    // Watches the search box input if it changes, it fetches new data
    searchQuery(newVal) {
      if (newVal.length > 0) {
        // Calls the Backend Search Endpoint
        fetch(`http://localhost:8000/search?q=${newVal}`)
          .then(res => res.json())
          .then(data => {
            this.lessons = data;
          })
          .catch(err => console.error("Search error:", err));
      } else {
        // If search is cleared, reload original lessons
        this.fetchLessons();
      }
    }
  },

  methods: {
    selectTopic(t) {
      this.selectedTopic = t;
      this.clearSearch();
    },

    clearSearch() {
      this.searchQuery = "";
    },

    // [Requirement: Add to Cart]
    // Visually reduces the space count if the item is in the cart
    getSpaces(lesson) {
      return this.cartStore.contains(lesson._id) 
        ? lesson.spaces - 1 
        : lesson.spaces;
    },

    // Logic for button text: "Enroll", "Remove", or "Sold Out"
    getCartButtonLabel(lesson) {
      if (this.getSpaces(lesson) === 0 && !this.cartStore.contains(lesson._id)) return "Sold Out";
      return this.cartStore.contains(lesson._id) ? "Remove" : "Enroll";
    },

    // Toggles the item in the Global Cart Store
    toggleCart(lesson) {
      if (this.cartStore.contains(lesson._id)) {
        this.cartStore.removeItem(lesson._id);
      } else {
        this.cartStore.addItem(lesson._id);
      }
    },

    // [Requirement: Fetch]
    // Fetches initial lesson data from the Backend API
    async fetchLessons() {
      try {
        const res = await fetch("https://talentclub-backend.onrender.com/lessons");
        this.lessons = await res.json();

        // Sets the Price Slider max value based on the most expensive lesson
        if (this.lessons.length > 0) {
          this.maxPriceAvailable = Math.max(...this.lessons.map(l => l.price));
          this.maxPrice = this.maxPriceAvailable;
        }
      } catch (err) {
        console.error("Error loading lessons:", err);
      }
    }
  },

  mounted() {
    this.fetchLessons().then(() => {
      // Handles "Filter by Topic" if clicking from Home Page
      const topicFromURL = this.$route.query.topic;
      if (topicFromURL) {
        this.selectedTopic = topicFromURL;
      }
    });
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
/* Base styles */
* { 
  box-sizing: border-box; 
  font-family: 'Inter', sans-serif; 
}

/* Main wrapper */
.main-page-wrap {
  min-height: 100vh;
  padding: 2rem 1rem;
  background-color: #fff; 
  color: #1f2937;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Section */
.header-section { margin-bottom: 2rem; }
.page-title { font-size: 2rem; font-weight: 800; color: #111827; margin-bottom: 0.5rem; } /* Main title */
.page-subtitle { color: #6b7280; margin-bottom: 1.5rem; } /* Subtitle text */

/* Search bar */
.search-wrapper {
  position: relative;
  max-width: 100%;
}
.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af; 
}
.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem; 
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s; 
}
.search-input:focus { border-color: #F97316; } 

/* Category */
.filter-label { 
  font-size: 0.9rem; 
  font-weight: 600; 
  color: #374151; 
  margin-bottom: 0.5rem; 
}

.boxs-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

/* Individual category buttons */
.cat-box {
  background: #f3f4f6;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s; 
  display: flex;
  align-items: center;
  gap: 6px;
}
.cat-box:hover { background: #e5e7eb; } 
.cat-box.active {
  background: #F97316; 
  color: white;
}

/* Secondary filter bar */
.secondary-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group { 
  display: flex; 
  gap: 1rem; 
  align-items: center; 
  flex-wrap: wrap; 
}

/* Location dropdown */
select { 
  padding: 0.5rem; 
  border: 1px solid #d1d5db; 
  border-radius: 6px; 
  background: white; 
}

.price-filter { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  font-size: 0.9rem; 
}

/* Grid layout for lesson cards */
.results-count { margin-bottom: 1rem; color: #6b7280; font-size: 0.9rem; } /* Shows number of lessons */
.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Card styling */
.lesson-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s; /* Hover animation */
}
.lesson-card:hover {
  transform: translateY(-5px); /* Lift effect */
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

/* Card image */
.card-image-wrapper { 
  position: relative; 
  height: 200px; 
  background: #f3f4f6; 
}

/* Lesson cover image */
.lesson-img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
}

/* Topic badge on top-right */
.topic-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ccfbf1;
  color: #0f766e;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

/* Card content section */
.card-content { 
  padding: 1.5rem; 
  display: flex; 
  flex-direction: column; 
  gap: 0.8rem; 
}

.card-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
}

.lesson-title { 
  font-size: 1.25rem; 
  font-weight: 700; 
  color: #111827; 
  margin: 0; 
  line-height: 1.3; 
}
.age-badge { 
  background: #ffedd5; 
  color: #c2410c; 
  font-size: 0.75rem; 
  padding: 4px 8px; 
  border-radius: 6px; 
  font-weight: 600; 
  white-space: nowrap;
}

/* Location text */
.lesson-loc { 
  color: #6b7280; 
  font-size: 0.9rem; 
  margin: 0; 
}

.spots-row { 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  color: #6b7280; 
  font-size: 0.9rem; 
}
.text-red { 
  color: #ef4444; 
  font-weight: 600; 
}

/* Card footer (price + buttons) */
.card-footer { 
  margin-top: 0.5rem; 
  display: flex; 
  flex-direction: column; 
  gap: 1rem; 
}

/* Price block formatting */
.price-block { 
  display: flex; 
  align-items: baseline; 
  gap: 4px; 
}
.curr-price { 
  font-size: 1.5rem; 
  font-weight: 800; 
  color: #F97316; 
}
.duration { 
  color: #9ca3af; 
  font-size: 0.9rem; 
}


.action-buttons { display: flex; gap: 0.5rem; }

button { cursor: pointer; }

/* Add-to-cart button */
.btn-primary {
  flex: 1;
  background: #F97316;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-primary:hover { background: #ea580c; }
.btn-primary:disabled { background: #9ca3af; cursor: not-allowed; }


/* Floating cart bar */ 
.cart-bar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #111827;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  z-index: 100; 
}

.btn-view-cart {
  background: #F97316;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: white;
  font-weight: bold;
}

/* Responsive styles */
@media (max-width: 640px) {
  .lessons-grid { grid-template-columns: 1fr; } /* One card per row */
  .secondary-filters { flex-direction: column; align-items: stretch; }
  .action-buttons { flex-direction: column; } /* Stack buttons */
}
</style>
