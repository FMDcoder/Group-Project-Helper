<template>
  <ul class="projects">
    <li
      v-for="p in getUserProjects()"
      :key="p.id"
      class="project-item"
      role="button"
      tabindex="0"
      @click="setCurrentProject(p.id)"
      @keydown.enter="setCurrentProject(p.id)"
      @keydown.space.prevent="setCurrentProject(p.id)"
    >
      {{ p.name }}
    </li>
  </ul>
</template>

<script>
export default {
  props: ["model", "redirect"],
  emits: ["project-selected"],
  methods: {
    getUserProjects() {
      return this.model.getUserProjects();
    },
    setCurrentProject(id) {
      this.model.setCurrentProject(id);
      if (this.redirect == true) {
        this.$router.push("/project");
      }
      else {
        this.$emit("project-selected");
      }
    },
  },
};
</script>

<style scoped>
/* Reset list spacing so it stays inside the card */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Each project row */
li {
  box-sizing: border-box;   /* ✅ prevents overflow */
  max-width: 100%;          /* ✅ never wider than container */
  width: 100%;
  padding: 10px 12px;
  margin: 10px 0;
  border-radius: 12px;
  background-color: #d8d8d8 !important;
  cursor: pointer;
  font-weight: 700;

  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

li:hover {
  background: rgba(37, 99, 235, 0.22) !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.10);
}

li:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
}

</style>
