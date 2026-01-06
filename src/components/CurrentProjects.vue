<template>
  <div class="projects">
    <h2>Active projects:</h2>
    <ul>
     <li v-for="p in getProjects()" :key="p.id">
       <router-link to="/project" @click="">
        {{ p.name }}
      </router-link>
      {{ p.progress }}
     </li>
    </ul> 
  </div>
</template>

<script>
import ProjectView from '@/views/ProjectView.vue';

  export default {
    props: ['model'],
    methods: {
      getProjects() {
        return this.model.getProjects();
      },
      setCurrentProject(id) {
        this.model.setCurrentProject(id);
      }
    },
  }
</script>