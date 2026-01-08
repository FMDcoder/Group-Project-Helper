<template>
  <section>
    <div class="container">
      <div class="grid-item">
        <Deadlines :model="model" current-project-only="false" />
      </div>
      <div class="grid-item">
        <h2>Active projects:</h2>
        <UserProjects :model="model" :redirect="true" />
        <NewProjBtn :model="model" />
        <FindProjects :model="model" />
      </div>
    </div>
  </section>
</template>

<script>
  import Deadlines from "../components/Deadlines.vue";
  import FindProjects from "@/components/FindProjects.vue";
  import NewProjBtn from "@/components/NewProjBtn.vue";
  import UserProjects from "@/components/UserProjects.vue";
  
  export default {
    props: ['model', 'reRenderKey'],
    components: { Deadlines, NewProjBtn, UserProjects, FindProjects },
  }
</script>

<style>
  div.container {
    display: grid;
    grid-template: 1fr 1fr / 1fr 1fr;
  }
  div.grid-item {
    padding: 5px;
  }
</style>