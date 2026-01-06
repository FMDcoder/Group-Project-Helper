<template>
  <div class="projects">
    <h2>Active projects:</h2>
    <ul>
     <li v-for="p in getProjects()" :key="p.id">
       {{ p.name }} {{ p.progress }}
     </li>
    </ul> 
  </div>
</template>

<script>
  export default {
    props: ['model'],
    methods: {
      getProjects() {
        return this.model.getProjects();
      },
    },
  }
</script>