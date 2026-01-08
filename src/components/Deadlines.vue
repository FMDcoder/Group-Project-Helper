<template>
  <div class="deadlines">
    <h2>Upcoming Deadlines:</h2>
    <ul>
      <li v-for="t in getTasks()" :key="t.id">
        <div>
          <router-link to="/taskboard" @click="setCurrentProject(t.projectId)">
            {{ t.deadline }} {{ t.name }}
          </router-link>
        </div>
          <ul v-if="currentProjectOnly != true">
            <li>
              <router-link to="/project" class="project-link" @click="setCurrentProject(t.projectId)">
                {{ t.projectName }}
              </router-link>
            </li>
          </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['model', 'currentProjectOnly'],
    methods: {
      getTasks() {
        if (this.currentProjectOnly === true) {
          return this.model.getProjectTasksByDeadline();
        }
        return this.model.getTasksByDeadline();
      },
      getProjectName(id) {
        return this.model.getProject(id).name;
      },
      setCurrentProject(projectId) {
        this.model.setCurrentProject(projectId);
      }
    },
  }
</script>

<style scoped>
  .project-link {
    width: fit-content;
    cursor: pointer;
  }
</style>