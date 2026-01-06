<template>
  <div class="newProjBtn">
    <button @click="openCreateOpenProject">New project</button>
  </div>
  <div v-if="createProjectVisible" @click.self="closePopupCreateProject" class="popup">
    <div class="container">
      <h2>Skapa projekt</h2>
      <form @submit.prevent="createProject">
          <div>
                <label for="project"></label>
                <input type="text" name="project" v-model="projectName">
          </div>
          <button type="submit" name="submit">Skapa</button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['model'],
    data() {
      return {
        projectName: "",
        createProjectVisible:false
      }
    },
    methods: {
      openCreateOpenProject() {
          this.createProjectVisible = true
      },

      closePopupCreateProject() {
        this.createProjectVisible = false
      },

      projects() {
          return this.model?.getProjects() ?? [];
      },

      getProjectMaxId() {
          return  this.projects().length > 0
                ? Math.max(...this.projects().map(p => p.id || 0))
                : 0;
      },

      createProject() {
          this.projects().push({
                "id": (this.getProjectMaxId() + 1),
                "name": this.projectName,
                "progress": 0,
                "tasks": []
          })
      }
    },
  }
</script>

<style scoped>
  .popup {
    width:100%;
    height: 100%;
    top:0;
    left: 0;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 50%;
    height: 300px;
    background-color: wheat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

</style>