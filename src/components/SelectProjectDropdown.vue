<template>
  <b-dd>
   <b-dd-item v-for="p in getProjects()" :key="p.id">
     <!-- router-link to="/project" @click="">
      {{ p.name }}
    </router-link-->
    {{ p.progress }}
   </b-dd-item>
  </b-dd> 
</template>

<script>
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