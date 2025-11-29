<template>
  <div class="about-page">

    <section class="about-header">
      <div class="container">
        <h1>About TalentClub</h1>
        <p class="header-subtext">
          Dedicated to providing exceptional after-school programs that foster growth,
          learning, and development in a safe, supportive environment.
        </p>
      </div>
    </section>

    <section class="mission-section">
      <div class="container mission-grid">

        <div class="mission-text">
          <h2>Our Mission</h2>
          <p>
            At TalentClub, we believe every child deserves access to high-quality enrichment programs that build confidence, develop skills, and inspire lifelong learning.
          </p>
          <p>
            We partner with certified instructors to deliver comprehensive programs across multiple disciplines, creating opportunities for children to explore their interests and reach their full potential.
          </p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <h3>500+</h3>
            <p>Students Enrolled</p>
          </div>
          <div class="stat-card">
            <h3>50+</h3>
            <p>Expert Instructors</p>
          </div>
          <div class="stat-card">
            <h3>12</h3>
            <p>Program Categories</p>
          </div>
          <div class="stat-card">
            <h3>98%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>

      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <div class="section-header">
          <h2>Our Core Values</h2>
        </div>

        <div class="values-grid">
          <div class="value-card" v-for="value in coreValues" :key="value.title">
            
            <div class="icon-box" v-html="value.icon"></div>
            
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="ready-section">
      <div class="container ready-content">
        <h2>Ready to Get Started?</h2>
        <p>
          Join hundreds of families who trust TalentClub for their children's educational enrichment.
        </p>
        
        <router-link to="/lessons" class="btn-white">Browse Programs</router-link>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: "AboutPage",
  data() {
    return {
      // We store this here so we can loop over it in the template above
      coreValues: [
        {
          title: "Excellence",
          description: "Committed to the highest standards in education and instruction",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`
        },
        {
          title: "Community",
          description: "Building strong connections between students, families, and educators",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
        },
        {
          title: "Care",
          description: "Providing a nurturing environment where every child can thrive",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
        }
      ]
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

/* Base Styles */
* {
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

.about-page {
  background: #f9fafb;
  color: #0f172a;
  padding-bottom: 4rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.bg-white { background: #ffffff; }
.bg-cream { background: #fff7ed; }
.bg-dark { background: #793e13; }

/* Header Section */
.about-header {
  background: #fff7ed;
  text-align: center;
  padding: 6rem 0 4rem;
}

.about-header h1 {
  font-size: clamp(2.5rem, 5vw, 3rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.header-subtext {
  max-width: 700px;
  margin: 0 auto;
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.6;
}

/* Mission & Stats Section */
.mission-section {
  padding: 5rem 0;
  background: #ffffff;
}

.mission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.mission-text h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.mission-text p {
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.stat-card {
  background: #ea580c;
  color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h3 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-card p {
  font-size: 0.9rem;
  font-weight: 500;
  color: #ffedd5;
}

/* Core Values Section */
.values-section {
  padding: 5rem 0;
  background: #f9fafb;
}

.values-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.value-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-box {
  background: #ea580c;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

.value-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.value-card p {
  color: #64748b;
  line-height: 1.6;
}

/* Ready to get started Section */

.ready-section {
  background: #793e13;      
  color: #ffffff;           
  text-align: center;      
  padding: 5rem 1.5rem;      
  border-radius: 16px;       
  margin: 2rem 0;            
}

.ready-section h2 {
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 700;
}

.ready-section p {
  color: #cbd5e1;            
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
}

.btn-white {
  background: #ffffff;
  color: #0f172a;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: background 0.2s;
}

.btn-white:hover {
  background: #f3f4f6;
}

/* Responsiveness  */
@media (max-width: 900px) {
  .mission-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .stats-grid {
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

}
</style>