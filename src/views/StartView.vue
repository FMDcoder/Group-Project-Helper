<template>
  <section>
    <Deadlines :model="model" />
    <CurrentProjects :model="model" />
    <NewProjBtn :model="model" />
  </section>
</template>

<script>
  import Deadlines from "../components/Deadlines.vue";
  import CurrentProjects from "@/components/CurrentProjects.vue";
  import NewProjBtn from "@/components/NewProjBtn.vue";
  
  export default {
    props: ['model', 'reRenderKey'],
    components: { Deadlines, NewProjBtn, CurrentProjects },
  }
</script>