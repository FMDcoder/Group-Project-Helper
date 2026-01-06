<template>
  <nav class="topnav">
    <div class="nav-left">
      <router-link to="/" class="nav-link">Startsidan</router-link>
      <router-link to="/project" class="nav-link">Projekt</router-link>
      <router-link to="/taskboard" class="nav-link">Taskboard</router-link>
    </div>

    <!-- optional: small debug button / area -->
      <button
      class="nav-link nav-debug"
      @click="showDebug = !showDebug"
    >
      {{ showDebug ? "Hide Projects" : "Show Projects" }}
  </button>

  </nav>

  <pre v-if="showDebug" class="debug">{{ results }}</pre>

  <router-view :model="model" :reRenderKey="reRenderKey" />
</template>

<script>
import GroupProjectHelperModel from './model.js'

  export default {
    data() {
      return {
        model: new GroupProjectHelperModel(this.reRender.bind(this)),
        reRenderKey: 0,
        results: [],
        showDebug: false
      }
    },
    async mounted() {
      // Run database setup when page loads
      await this.setupDatabase();
    },
    methods: {
      reRender() {
        this.reRenderKey += 1;
      },
      async setupDatabase() {
        await this.model.setupDatabase();
        this.results = await this.model.testDatabase();
      }
    }
  }
  
</script>
<style>
  .topnav {
    display: flex;
    align-items: center;
    justify-content: space-between;
  
    padding: 0.9rem 1.2rem;
    background: #b2baca;          /* dark navbar */
    border-bottom: 3px solid #374151;
  }
  
  .nav-left {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  
  .nav-link {
    font-size: 1.15rem;           /* bigger text */
    font-weight: 700;
    color: #e5e7eb;
    text-decoration: none;
  
    padding: 0.55rem 0.95rem;
    border-radius: 999px;         /* pill look */
    transition: transform 120ms ease, background 120ms ease;
  }
  
  .nav-link:hover {
    background: #1f2937;
    transform: translateY(-1px);
  }
  
  /* Vue Router automatically adds this class */
  .router-link-active.nav-link {
    background: #2563eb;          /* colorful active tab */
    color: white;
  }
  
  /* debug button styled like nav links */
.nav-debug {
  background:#2563eb;
  border-color:#2563eb;
  
}

.nav-debug:hover {
  background: #1f2937;
}

/* when debug is ON, highlight it */
.nav-debug.active {
  background: #16a34a;   /* green */
  color: white;
  border-color: transparent;
}
  </style>
  