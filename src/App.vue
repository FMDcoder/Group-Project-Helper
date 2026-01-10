<template>
  <div v-if="this.dbReady" :key="this.reRenderKey">
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

    <router-view :model="model" :reRenderKey="reRenderKey" />
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
/* main navbar container */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 1000;

  background: rgba(241, 245, 249, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
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
  flex-wrap: wrap;
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
</style>
