<template>
  <div class="dropdown">
    <button class="dropdown-toggle" @click="toggleDropdown" aria-haspopup="true" :aria-expanded="isOpen">Projects 
      {{ selectedOption || placeholder }} ▼
    </button>
    <ul v-if="isOpen" class="dropdown-menu">
  <li
    v-for="option in options"
    :key="option.value"
    @click="setOption(option)"
  >
    {{ option.label }}
  </li>
  <NewProjBtn class="dropdown-toggle" :model="model" >Ny project</NewProjBtn>
</ul>

  </div>
</template>

<script> 
import NewProjBtn from './NewProjBtn.vue';
export default {
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
      this.$emit("option-selected", option);
    }
  }
};

</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

/* button (matches nav pills) */
.dropdown-toggle {
  background-color: #2563eb;     /* blue */
  color: white;
  font-weight: 700;
  font-size: 1rem;

  padding: 0.55rem 1rem;
  border-radius: 999px;          /* pill shape */
  border: none;
  cursor: pointer;

  transition: background-color 120ms ease, transform 120ms ease;
}

.dropdown-toggle:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

/* dropdown panel */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;

  background: #484b53;           /* dark panel */
  border-radius: 12px;
  padding: 0.25rem 0;

  min-width: 180px;
  z-index: 50;

  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

/* options */
.dropdown-menu li {
  padding: 0.6rem 1rem;
  cursor: pointer;
  color: #e5e7eb;
  font-weight: 600;

  transition: background-color 120ms ease;
}

/* hover color (this is what you asked for) */
.dropdown-menu li:hover {
  background-color: #2563eb;     /* blue hover */
  color: white;
}

/* optional: highlight selected item */
.dropdown-menu li.selected {
  background-color: #1e40af;
}

</style>