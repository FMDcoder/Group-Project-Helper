<template>
  <ul>
    <li v-for="p in getUserProjects()" @click="setCurrentProject(p.id)">
      {{ p.name }}
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['model', 'redirect'],
     data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    getUserProjects() {
      return this.model.getUserProjects();
    },
    setCurrentProject(id) {
      this.model.setCurrentProject(id);
      if (this.redirect == true) {
        this.$router.push('/project');
      }
    }
  },
}
</script>

<style scoped>
.projects {
  max-width: 500px;
}

li {
  cursor: pointer;
  width: fit-content;
}

.hint {
  color: #666;
  font-style: italic;
}
</style>