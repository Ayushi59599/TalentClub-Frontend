<template>
  <!-- MAIN PAGE -->
  <div class="lessons-page main-page-wrap">

    <div class="container">

      <!-- ========== PAGE HEADER ========== -->
      <div class="header-section">
        <h1 class="page-title">All Activities</h1>
        <p class="page-subtitle">Browse our complete collection of after-school programs</p>

        <!-- Search Bar -->
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

      <!-- ========== TOPICS FILTERS  ========== -->
      <div class="category-filters">
        <p class="filter-label">Filter by Category</p>

        <div class="boxs-row">

          <!-- Show "All" box -->
          <button 
            :class="['cat-box', selectedTopic === '' ? 'active' : '']"
            @click="selectTopic('')"
          >
            All Activities
          </button>

          <!-- Create a box for each topic -->
          <button
            v-for="t in uniqueTopics"
            :key="t"
            :class="['cat-box', selectedTopic === t ? 'active' : '']"
            @click="selectTopic(t)"
          >
            <!-- Cute icons for each category -->
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
            <span v-else>✨</span> <!-- fallback for any future subjects -->

            {{ t }}
          </button>

        </div>
      </div>

      <!-- ==========   LOCATION + PRICE + SORTING FILTERS ========== -->
      <div class="secondary-filters">

        <!-- LEFT SIDE FILTERS -->
        <div class="filter-group">

          <!-- Location Dropdown -->
          <select v-model="selectedLocation" @change="clearSearch()">
            <option value="">📍 All Locations</option>
            <option v-for="l in uniqueLocations" :key="l" :value="l">
              {{ l }}
            </option>
          </select>

          <!-- Price Range Slider -->
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

        <!-- RIGHT SIDE SORTING -->
        <div class="sort-group">
          <span class="sort-label">Sort by:</span>

          <select v-model="sortKey" @change="sortAsc = true" class="sort-select">
            <option value="">Default</option>
            <option value="price">Price</option>
            <option value="location">Location</option>
            <option value="spaces">Spaces</option>
            <option value="topic">Topic</option>
          </select>

          <!-- Sort direction (ASC / DESC) -->
          <button 
            v-if="sortKey"
            class="sort-dir-btn"
            @click="sortAsc = !sortAsc"
          >
            {{ sortAsc ? '↑' : '↓' }}
          </button>
        </div>
      </div>

      <!-- CART NOTICE BAR -->
      <div class="cart-bar" v-if="cartItems.length > 0">
        <span>{{ cartItems.length }} items in cart</span>
        <button class="btn-view-cart" @click="$router.push('/cart')">
          View Cart
        </button>
      </div>

      <!-- RESULTS COUNT -->
      <p class="results-count">
        Showing {{ filteredLessons.length }} activities
      </p>

      <!-- ========== LESSON CARDS GRID ========== -->
      <div class="lessons-grid">

        <!-- Render one card per lesson -->
        <div
          v-for="lesson in filteredLessons"
          :key="lesson._id"
          class="lesson-card"
        >

          <!-- IMAGE + TAG -->
          <div class="card-image-wrapper">
            <img v-if="lesson.image" :src="lesson.image" class="lesson-img"/>
            <div v-else class="lesson-img placeholder"></div>

            <span class="topic-tag">{{ lesson.topic }}</span>
          </div>

          <!-- CARD CONTENT -->
          <div class="card-content">

            <div class="card-header">
              <h3 class="lesson-title">{{ lesson.topic }}</h3>
              <span class="age-badge">Ages 6-12</span>
            </div>

            <p class="lesson-loc">📍 {{ lesson.location }}</p>

            <div class="spots-row">
              <span class="user-icon">👤</span>
              <span :class="{'text-red': lesson.spaces < 3}">
                {{ lesson.spaces }} spots left
              </span>
            </div>

            <!-- PRICE + BUTTONS -->
            <div class="card-footer">

              <div class="price-block">
                <span class="curr-price">£{{ lesson.price }}</span>
                <span class="duration">/ term</span>
              </div>

              <div class="action-buttons">

                <!-- Details button -->
                <button class="btn-details" @click="viewDetails(lesson)">
                  Details
                </button>

                <!-- Add / Remove / Sold Out -->
                <button
                  class="btn-primary"
                  :disabled="lesson.spaces === 0 && !isInCart(lesson._id)"
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
export default {
  data() {
    return {
      lessons: [],          
      cartItems: [],        
      searchQuery: "",      
      selectedTopic: "",    
      selectedLocation: "", 
      maxPrice: 100,        
      maxPriceAvailable: 100, 
      sortKey: "",         
      sortAsc: true         
    };
  },

  // Automatically updates filtered list 
  computed: {
    // Get list of topics for filter buttons
    uniqueTopics() {
      return [...new Set(this.lessons.map(l => l.topic))];
    },

    // Get list of locations for dropdown
    uniqueLocations() {
      return [...new Set(this.lessons.map(l => l.location))];
    },

    // Filter + sort lessons
    filteredLessons() {
      // filtering
      let list = this.lessons.filter(l => {
        return (
          (!this.selectedTopic || l.topic === this.selectedTopic) &&
          (!this.selectedLocation || l.location === this.selectedLocation) &&
          l.price <= this.maxPrice &&
          (!this.searchQuery || l.topic.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      });

      //  sorting
      if (!this.sortKey) return list;

      return list.slice().sort((a, b) => {
        let A = a[this.sortKey], B = b[this.sortKey];
        if (typeof A === "string") A = A.toLowerCase();
        if (typeof B === "string") B = B.toLowerCase();
        return this.sortAsc ? A > B : A < B ? -1 : 1;
      });
    }
  },


  //METHODS
  methods: {
    // When selecting a topic box
    selectTopic(t) {
      this.selectedTopic = t;
      this.clearSearch();
    },

    // Reset search when user selects a filter
    clearSearch() {
      this.searchQuery = "";
    },

    // Is lesson already in cart?
    isInCart(id) {
      return this.cartItems.includes(id);
    },

    // Button label logic
    getCartButtonLabel(lesson) {
      if (lesson.spaces === 0 && !this.isInCart(lesson._id)) return "Sold Out";
      return this.isInCart(lesson._id) ? "Remove" : "Enroll";
    },

    // Add or remove from cart
    toggleCart(lesson) {
      if (this.isInCart(lesson._id)) {
        // Remove
        lesson.spaces++;
        this.cartItems = this.cartItems.filter(id => id !== lesson._id);
      } else if (lesson.spaces > 0) {
        // Add
        lesson.spaces--;
        this.cartItems.push(lesson._id);
      }
    },

    // Navigate to details page
    viewDetails(lesson) {
      this.$router.push({ name: "LessonDetail", params: { id: lesson._id } });
    },

    // Fetch lessons from backend
    async fetchLessons() {
      try {
        const res = await fetch("http://localhost:8000/lessons");
        this.lessons = await res.json();

        // Set price slider max from data
        if (this.lessons.length > 0) {
          this.maxPriceAvailable = Math.max(...this.lessons.map(l => l.price));
          this.maxPrice = this.maxPriceAvailable;
        }
      } catch (err) {
        console.error("Error loading lessons:", err);
      }
    }
  },

  //Run when page loads

  mounted() {
    this.fetchLessons().then(() => {
      // Restore cart from localStorage
      const saved = JSON.parse(localStorage.getItem("cartItems") || "[]");
      this.cartItems = saved.filter(id => this.lessons.some(l => l._id === id));

      // Optional: pre-select topic from URL (if using query params)
      const topicFromURL = this.$route.query.topic;
      if (topicFromURL) {
        this.selectedTopic = topicFromURL;
      }
    });
  },

  //Save cart whenever it changes
  watch: {
    cartItems: {
      deep: true,
      handler() {
        localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      }
    }
  }
};
</script>







<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Global resets + font family */
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

/* View details button */
.btn-details {
  padding: 0.7rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  color: #374151;
  font-weight: 500;
  transition: background 0.2s;
}
.btn-details:hover { 
  background: #f9fafb; 
  border-color: #d1d5db; 
}

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
