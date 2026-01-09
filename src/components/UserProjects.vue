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
  methods: {
    getUserProjects() {
      return this.model.getUserProjects();
    },
    setCurrentProject(id) {
      this.model.setCurrentProject(id);
      if (this.redirect == true) {
        this.$router.push("/project");
      }
    },
  },
};
</script>

<style scoped>
.projects {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-item {
  display: block;
  width: 100%;
  padding: 10px 12px;
  margin: 10px 0;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.project-item:hover {
  background: rgba(37, 99, 235, 0.22); /* darker hover */
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.10);
}

.project-item:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
  background: rgba(37, 99, 235, 0.28);
}
</style>
