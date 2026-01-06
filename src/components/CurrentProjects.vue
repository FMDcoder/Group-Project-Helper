<template>
  <div class="projects">
    <h2>Active projects:</h2>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search projects..."
    />

    <p v-if="!searchQuery.trim()" class="hint">
      Please type something to search for a project.
    </p>

    <ul v-else-if="filteredProjects.length">
      <li v-for="p in filteredProjects" :key="p.id">
      <router-link to="/project" @click="">
        {{ p.name }}
      </router-link> — {{ p.progress }}
     </li>
    </ul>

    <p v-else class="hint">
      No projects found.
    </p>
  </div>
</template>

<script>
  import ProjectView from '@/views/ProjectView.vue';

  export default {
    props: ['model'],
     data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    getProjects() {
    return this.model.getProjects();
    },
    setCurrentProject(id) {
    this.model.setCurrentProject(id);
    }
  },
  computed: {
    // Always return an array so Vue never crashes
    projects() {
      return this.model?.getProjects() ?? [];
    },
    // This recomputes automatically when searchQuery changes
    filteredProjects() {
      const query = this.searchQuery.trim().toLowerCase();

      if (!query) {
        return [];
      }

      return this.projects.filter(project =>
        project.name.toLowerCase().includes(query)
      );
    }
  }
}
</script>

<style scoped>
.projects {
  max-width: 500px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
}

.hint {
  color: #666;
  font-style: italic;
}
</style>