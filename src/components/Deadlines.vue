<template>
  <div class="deadlines">
    <h2>Upcoming Deadlines:</h2>
    <ul>
      <li v-for="t in getTasks()" :key="t.id">
        {{ t.deadline }} {{ t.title }}

        <div v-if="hasProject()">
          <ul>
            <li>
              {{ getProjectName(t.project) }}
            </li>
          </ul>
        </div>

      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['model', 'project'],
    methods: {
      getTasks() {
        if (! this.hasProject()) {
          return this.model.getProjectTasksByDeadline(this.project);
        }
        return this.model.getTasksByDeadline();
      },
      hasProject() {
        return this.project === undefined;
      },
      getProjectName(id) {
        return this.model.getProject(id).name;
      }
    },
  }
</script>