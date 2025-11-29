<template>
  <div class="homepage">
    <section class="hero">
      <div class="hero-content container">
        <h1 class="hero-title">Discover Amazing<br>Activities</h1>
        <p class="hero-subtext">
          From sports to arts, STEM to music—find the perfect activities to inspire and engage your child after school.
        </p>

        <div class="hero-search-wrapper" @click="goToClasses">
          <div class="search-visual">
            <span class="search-icon">🔍</span>
            <span class="search-placeholder">What are you looking for?</span>
          </div>
          <button class="search-btn">Search</button>
        </div>

        <div class="hero-tags">
          <span>Popular:</span>
          <router-link class="tag-link" :to="{ path: '/lessons' }">STEM</router-link>
          <router-link class="tag-link" :to="{ path: '/lessons' }">Art</router-link>
          <router-link class="tag-link" :to="{ path: '/lessons' }">Music</router-link>
          <router-link class="tag-link" :to="{ path: '/lessons' }">Languages</router-link>
        </div>
      </div>

      <div class="wave-separator">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            class="shape-fill"
          />
        </svg>
      </div>
    </section>

    <section id="categories" class="section-padding bg-white">
      <div class="container">
        <div class="section-header">
          <h2>Explore Categories</h2>
          <p>Find the perfect fit for your child's interests</p>
        </div>

        <div class="category-grid">
          <div
            v-for="category in programCategories"
            :key="category.name"
            class="category-card"
            @click="filterByCategory(category.name)"  
          >
            <div class="category-icon-circle">
              <span class="emoji-icon">{{ category.emoji }}</span>
            </div>
            <p class="category-name">{{ category.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section-padding bg-light">
      <div class="container">

        <div class="section-header row-header">
          <div>
            <h2>Featured Programs</h2>
            <p>Top-rated activities filling up fast</p>
          </div>
          <router-link to="/lessons" class="btn-text-arrow">View All Activities →</router-link>
        </div>

        <div v-if="featuredLessons.length > 0" class="lessons-grid">
          
          <div v-for="lesson in featuredLessons" :key="lesson._id" class="lesson-card">
            
            <div class="card-image-wrapper">
              <img v-if="lesson.image" :src="lesson.image" class="lesson-img" />
              <div v-else class="lesson-img placeholder"></div>
              <span class="topic-tag">{{ lesson.topic }}</span>
            </div>

            <div class="card-content">
              <div class="card-header">
                <h3 class="lesson-title">{{ lesson.topic }}</h3>
                <span class="location-text">📍 {{ lesson.location }}</span>
              </div>
              <div class="spots-row">
                <span class="user-icon">👤</span>
                <span :class="{ 'text-urgent': lesson.spaces < 3 }">
                  {{ lesson.spaces }} spots left
                </span>
              </div>
              <div class="card-footer">
                <span class="curr-price">£{{ lesson.price }}</span>
              </div>
            </div>

          </div>
        </div>

        <div v-else>
          <p>No classes currently featured. Check back soon!</p>
        </div>

      </div>
    </section>

   <section class="section-padding bg-white">
      <div class="container">
        <div class="section-header">
          <h2>Why Families Choose Us</h2>
        </div>

        <div class="features-grid">
          <div class="feature-box">
            <div class="feature-icon-wrap">
              <span class="feature-emoji">👩‍🏫</span>
            </div>
            <h3>Expert Tutors</h3>
            <p>Certified instructors ensuring quality learning.</p>
          </div>

          <div class="feature-box">
            <div class="feature-icon-wrap">
              <span class="feature-emoji">🛡️</span>
            </div>
            <h3>Safe Environment</h3>
            <p>All activities are vetted for safety and comfort.</p>
          </div>

          <div class="feature-box">
            <div class="feature-icon-wrap">
              <span class="feature-emoji">📅</span>
            </div>
            <h3>Flexible Scheduling</h3>
            <p>Classes that fit your busy family timetable.</p>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      // Static data for the Categories section
      programCategories: [
        { name: "Physics", emoji: "🧪" },
        { name: "Music", emoji: "🎵" },
        { name: "Biology", emoji: "🧬" },
        { name: "Computer Science", emoji: "💻" },
        { name: "Art", emoji: "🎨" },
        { name: "Photography", emoji: "📷" }
      ],
      lessons: []  // Will store the live data from the backend
    };
  },
  computed: {
    // Filter Logic:
    // Checks if spaces are available and slices the array to show only the top 3 results
    featuredLessons() {
      return this.lessons.filter(l => l.spaces > 0).slice(0, 3);
    }
  },
  methods: {
    // Helper to navigate to the main shop page
    goToClasses() {
      this.$router.push("/lessons");
    },
    
    // Helper that navigates and adds a filter query to the URL
    filterByCategory(category) {
      this.$router.push({ path: "/lessons", query: { topic: category } });
    },
    
    // [Requirement: Fetch]
    // Retrieves lesson data from the Node.js/Express Backend
    async fetchLessons() {
      try {
        const res = await fetch("https://talentclub-backend.onrender.com/lessons");
        if (!res.ok) throw new Error("Failed to fetch lessons");
        this.lessons = await res.json();
      } catch (err) {
        console.error("Error fetching lessons:", err);
        this.lessons = [];
      }
    }
  },
  mounted() {
    // Load data as soon as the component is on screen
    this.fetchLessons();
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Base styles */
* {
  box-sizing: border-box;
  font-family: 'Inter', sans-serif; 
}

.homepage {
  background: #ffffff; 
  color: #111827; 
  padding-bottom: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.bg-white { background: #ffffff; }
.bg-light { background: #f3f4f6; }
.section-padding { padding: 5rem 0; }

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #111827; 
}

.section-header p {
  color: #6b7280; 
  font-size: 1.1rem;
}

.row-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  text-align: left;
}

.text-left { text-align: left; }

/* Hero Section */

.hero {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  padding: 8rem 0 10rem 0; 
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  color: #111827; 
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -0.03em;
}

.hero-subtext {
  font-size: 1.15rem;
  color: #4b5563; 
  max-width: 600px;
  margin: 0 auto 2.5rem auto;
  line-height: 1.6;
}

/* Hero Search Box */
.hero-search-wrapper {
  background: #ffffff;
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  border-radius: 50px;
  padding: 6px;
  display: flex;
  align-items: center;
  box-shadow: 0 20px 40px rgba(249, 115, 22, 0.15);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.5);
  transition: transform 0.2s;
}

.hero-search-wrapper:hover { transform: translateY(-2px); }

.search-visual {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 1.5rem;
  gap: 10px;
  color: #9ca3af; 
}

.search-btn {
  background: #F97316;
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 40px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
}

.hero-tags {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #6b7280; 
}

.tag-link {
  background: none;
  border: none;
  color: #F97316; 
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  padding: 0;
}

/* Wave separator */
.wave-separator {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  line-height: 0;
  transform: rotate(180deg);
}

.wave-separator svg {
  display: block;
  width: calc(100% + 1.3px);
  height: 80px;
}

.wave-separator .shape-fill { fill: #ffffff; }

/* Categories */

.category-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  width: 140px;
  padding: 1.5rem 1rem;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  border-color: #F97316; 
}

.category-icon-circle {
  width: 60px;
  height: 60px;
  background: #fff7ed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.category-name {
  font-weight: 600;
  color: #111827; 
  font-size: 0.95rem;
}

/* Featured Lessons */

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 2rem;
}

.lesson-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.lesson-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.card-image-wrapper {
  position: relative;
  height: 200px;
  background: #f3f4f6;
}

.lesson-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.topic-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255,255,255,0.9);
  color: #111827;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
}

.lesson-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.location-text {
  color: #6b7280;
  font-size: 0.9rem;
}

.spots-row {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.text-urgent { color: #ef4444; font-weight: 600; }

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.curr-price {
  font-size: 1.4rem;
  font-weight: 800;
  color: #F97316; 
}

.btn-card-action {
  background: #111827; 
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-card-action:hover { opacity: 0.9; }

.btn-text-arrow {
  color: #F97316; /* orange */
  font-weight: 600;
  text-decoration: none;
  font-size: 1.1rem;
}

.btn-text-arrow:hover span { margin-left: 5px; transition: margin 0.2s; }

/* Features Section */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-box {
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.feature-icon-wrap { font-size: 2.5rem; margin-bottom: 1rem; }

.feature-box h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-box p {
  color: #6b7280;
  line-height: 1.6;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .hero { padding: 6rem 0 8rem 0; }
  .hero-title { font-size: 2.5rem; }
  .row-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .lessons-grid { grid-template-columns: 1fr; }
}
</style>
