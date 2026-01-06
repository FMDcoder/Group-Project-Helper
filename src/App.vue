<template>
  <nav>
    <router-link to="/">Startsidan</router-link> |
    <router-link to="/project">Projekt</router-link> |
    <router-link to="/taskboard">Taskboard</router-link>
    <pre>{{ results }}</pre>
  </nav>

  <router-view :model="model", :reRenderKey="reRenderKey" />
</template>

<script>
import GroupProjectHelperModel from './model.js'

  export default {
    data() {
      return {
        model: new GroupProjectHelperModel(this.reRender.bind(this)),
        reRenderKey: 0,
        results: []
      }
    },
    async mounted() {
      // Run database setup when page loads
      await this.setupDatabase();
    },
    methods: {
      reRender() {
        this.reRenderKey += 1;
      },
      async setupDatabase() {
        this.results = await this.model.setupDatabase();
      }
    }
  }
</script>