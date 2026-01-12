<template>
  <div ref="theBox" class="dropdown">
    <button
      class="dropdown-toggle"
      :class="{ 'dropdown-toggle-unselected': !getCurrentProjectName() }"
      @click="toggleDropdown"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      {{ getCurrentProjectName() || placeholder }} ▼
    </button>

    <div v-if="isOpen" class="dropdown-menu">
      <UserProjects :model="model" :redirect="false" @project-selected="closeBox" />
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
          <NewProjBtn :model="this.model"
            @modal-change="setModalState"
            @project-created="onProjectCreated"
            @close-esc="setCanClose(true)"
          />
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
      selectedOption: null,
      modalState: false,
      canClose: true,
      escHandler: null,
    };
  },

  methods: {
    toggleDropdown() {
      this.isOpen = !this.isOpen;
      
      if (this.isOpen) {
        this.escHandler = (e) => {
          if (e.key === "Escape") {
            this.escClose()
          }
        };
        window.addEventListener("keydown", this.escHandler);
      }
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
    },
    clickoutside(event)
    {
      const box=this.$refs.theBox
      if (this.canClose) {
        if(this.isOpen && box && !box.contains(event.target)){
          this.isOpen = false
        }
      }
      else {
        this.canClose = !this.modalState;
      }
    },
    escClose()
    {
      const box=this.$refs.theBox
      if (this.canClose) {
        if(this.isOpen && box) {
          this.isOpen = false

          if (this.escHandler) {
            window.removeEventListener("keydown", this.escHandler);
            this.escHandler = null;
          }
        }
      }
      else {
        this.canClose = !this.modalState;
      }
    },
    closeBox()
    {
      const box=this.$refs.theBox
      if(this.isOpen && box) {
        this.isOpen = false
      }
    },
    setModalState(state)
    {
      this.modalState = state;
      if (state) this.canClose = false;
    },
    setCanClose () {
      this.canClose = true;
    },
  },
  mounted(){
    document.addEventListener("click",this.clickoutside)
  },

  beforeUnmount(){
    document.removeEventListener("click", this.clickoutside)
    if (this.escHandler) window.removeEventListener("keydown", this.escHandler);
  }
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

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
.dropdown-toggle:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.dropdown-toggle-unselected {
  color: #f3f3f3;
  font-style: italic;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  /*background: rgba(250, 250, 250, 0.9);*/
  background: rgba(185, 197, 248, 0.9);
  border-radius: 12px;
  padding: 0.4rem 0.55rem; /* a bit tighter */
  min-width: 240px;
  z-index: 50;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

/* Reset list styling inside dropdown */
.dropdown-menu :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ---- Project items (white boxes) ---- */
.dropdown-menu :deep(.projects .project-item) {
  padding: 6px 10px;      /* ✅ shorter */
  margin: 6px 0;          /* ✅ less spacing */
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;

  color: #1b3564;         /* ✅ darker text */
  font-weight: 800;
  /*font-size: 14px;*/
}

/* Hover on project items */
.dropdown-menu :deep(.projects .project-item:hover) {
  background: rgba(127, 162, 228, 0.18);
  /* keep stable in dropdown 
  transform: none;
  box-shadow: none;*/
}

/* Keyboard focus */
.dropdown-menu :deep(.projects .project-item:focus-visible) {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
  background: rgba(37, 99, 235, 0.22);
}

/* ---- Action row (New project) ---- */
.menu-action {
  padding: 0.55rem 0;
  margin-top: 10px!important;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  cursor: default;
}

/* Keep action list text readable on dark background */
.dropdown-menu :deep(.menu-action li) {
  padding: 0;
  margin: 0;
  color: #e5e7eb;
}

</style>