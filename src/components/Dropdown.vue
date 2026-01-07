<template>
  <div class="dropdown">
    <button class="dropdown-toggle" @click="toggleDropdown" aria-haspopup="true" :aria-expanded="isOpen">
      {{ selectedOption || placeholder }} ▼
    </button>
    <ul v-if="isOpen" class="dropdown-menu" @click="setOption(option)" >
      <li v-for="option in options" :key="option.value">{{ option.label }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: "Select an option"
    }
  },
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
      this.$emit('option-selected', option);
    }
  }
};
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  background-color: #f1f1f1;
  padding: 10px;
  border: none;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  background-color: #ffffff;
  border: 1px solid #ccc;
  z-index: 1;
}

.dropdown-menu li {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #f1f1f1;
}
</style>