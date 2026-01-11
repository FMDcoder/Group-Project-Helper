<template>
  <div v-if="this.dbReady" class="topest" :key="this.reRenderKey">
    <nav class="top-nav">
      <div class="nav-inner">
        <div class="nav-left">
          <router-link to="/" class="nav-item">Startpage</router-link>
          <router-link to="/project" class="nav-item">Project</router-link>
          <router-link to="/taskboard" class="nav-item">Taskboard</router-link>
        </div>

        <div class="nav-right">
          <Dropdown
            :options="dropdownOptions"
            @option-selected="handleOptionSelected"
            placeholder="Select project"
            :model="model"
          />
        </div>
      </div>
    </nav>

    <pre v-if="showDebug" class="debug">{{ results }}</pre>
    <div class="content">
      <router-view :model="model" :reRenderKey="reRenderKey" />
    </div>
  </div>
  <div class="bottom-footer">
  </div>
</template>

<script>
import GroupProjectHelperModel from "./model.js";
import Dropdown from "./components/Dropdown.vue";

export default {
  components: { Dropdown },
  data() {
    return {
      model: new GroupProjectHelperModel(this.reRender.bind(this)),
      reRenderKey: 0,
      dbReady: false,
      results: [],
      showDebug: false,
      dropdownOptions: [
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
        { label: "Cherry", value: "cherry" },
      ],
    };
  },
  async created() {
    await this.setupDatabase();
  },
  methods: {
    reRender() {
      this.reRenderKey += 1;
    },
    async setupDatabase() {
      await this.model.setupDatabase();
      this.results = this.model.testDatabase();
      this.dbReady = this.model.dbReady;
    },
    handleOptionSelected(option) {
      console.log("Selected option:", option);
    },
    navigateKey(event) {
      if (!event.ctrlKey) return;

      if (event.key === "1") this.$router.push("/");
      if (event.key === "2") this.$router.push("/project");
      if (event.key === "3") this.$router.push("/taskboard");
    },
  },
  mounted() {
    window.addEventListener("keydown", this.navigateKey);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.navigateKey);
  },
};
</script>

<style>

h1, h2, h3, h4, h5, h6, p, span, a, button, li, ul, input, textarea {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

html, body {
  padding: 0;
  margin: 0;
}

.topest {
  top: 0;
}

/* main navbar container */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;

  background: #aebdf7;
  /*backdrop-filter: blur(10px); - this destroys positioning for new project modal*/
  border-bottom: 1px solid #153968 !important;
}

/* keeps navbar aligned with .page max-width */
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 18px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.nav-left {
  display: flex;
  gap: 10px;
  /*flex-wrap: wrap; - this destroys positioning for new project modal*/
  align-items: center;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* nav links as pills, matching your buttons/cards */
.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 10px 14px;
  border-radius: 999px;

  color: #0f172a;
  text-decoration: none;
  font-weight: 800;

  border: 1px solid transparent;
  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.nav-item:hover {
  background: rgba(37, 99, 235, 0.12);
  transform: translateY(-1px);
}

.nav-item:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
}

/* Vue Router active class */
.nav-item.router-link-active,
.nav-item.router-link-exact-active {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.10);
}

/* optional debug pre */
.debug {
  max-width: 1200px;
  margin: 12px auto 0;
  padding: 12px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
  overflow: auto;
}

.bottom-footer {
  background-color: #7281bd;
  width: 100%;
  /*height: 200px;*/
}

.content {
  width: 100%;
  min-height: 80vh;
}

</style>
