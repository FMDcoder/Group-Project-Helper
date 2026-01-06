<template>
  <div class="deadlines">
    <h2>Upcoming Deadlines:</h2>
    <ul>
      <li v-for="t in getTasks()" :key="t.id">
        {{ t.deadline }} {{ t.title }}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: ['model', 'project'],
    methods: {
      getTasks() {
        if (typeof project === undefined) {
          return this.model.getTasksByDeadline(project);
        }
        return this.model.getTasksByDeadline();
      },
    },
  }
</script>