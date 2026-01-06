<template>
  <nav>
    <router-link to="/">Startsidan</router-link> |
    <router-link to="/project">Projekt</router-link> |
    <router-link to="/taskboard">Taskboard</router-link>
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
      }
    },
    methods: {
      reRender() {
        this.reRenderKey += 1;
      },
    }
  }
</script>