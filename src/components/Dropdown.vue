<template>
  <div class="dropdown">
    <button
      class="dropdown-toggle"
      @click="toggleDropdown"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      {{ getCurrentProjectName() || placeholder }} ▼
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <UserProjects :model="model" :redirect="false" />
      <!--li
        v-for="option in options"
        :key="option.value"
        @click="setOption(option)"
      >
        {{ option.label }}
      </li-->

      <!-- action row -->
      <ul class="menu-action">
        <li>
          <NewProjBtn :model="this.model" @project-created="onProjectCreated" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import NewProjBtn from "./NewProjBtn.vue";
import UserProjects from "./UserProjects.vue";

export default {
  components: { NewProjBtn, UserProjects },

  props: ["model", "options", "placeholder"],

  data() {
    return {
      isOpen: false,
      selectedOption: null
    };
  },

  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },

    setOption(option) {
      this.selectedOption = option.label;
      this.isOpen = false;
      this.$emit("option-selected", option); // tell parent which project was selected
    },

    onProjectCreated(project) {
      // close dropdown and inform parent
      this.isOpen = false;

      // bubble up so App.vue (or whoever owns the array) can push it into the list
      this.$emit("project-created", project);
    },
    getCurrentProjectName() {
      let project = this.model.getCurrentProject();
      return project ? project.name : false;
    }
  }
};
</script>

<style scoped>
.dropdown { position: relative; display: inline-block; }

.dropdown-toggle {
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background-color 120ms ease, transform 120ms ease;
}
.dropdown-toggle:hover { background-color: #1d4ed8; transform: translateY(-1px); }

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #484b53;
  border-radius: 12px;
  padding: 0.25rem 0;
  min-width: 220px;
  z-index: 50;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

.dropdown-menu >>> ul {
  list-style: none;
}

.dropdown-menu > ul li, .dropdown-menu >>> ul li {
  padding: 0.6rem 1rem;
  cursor: pointer;
  color: #e5e7eb;
  font-weight: 600;
  transition: background-color 120ms ease;
}
.dropdown-menu >>> ul > li:hover { background-color: #2563eb; color: white; }

.menu-action {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.15);
  cursor: default;
}
</style>