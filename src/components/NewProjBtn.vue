<template>
  <div class="newProjBtn">
    <button @click="createProject()">New project</button>
  </div>
</template>

<script>
  export default {
    props: ['model'],
    methods: {
      createProject() {
        console.log("placeholder method...");
      },
    },
  }
</script>