<template>
  <section>
    <h1>Startsidan</h1>

    <p>Projekt: {{ project.name }}</p>

    <h2>Commit Deadlines</h2>
    <ul>
      <li v-for="c in commits" :key="c.id">
        {{ c.title }} – {{ c.deadline }}
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const project = ref({});
const commits = ref([]);

onMounted(async () => {
  const res = await fetch("http://localhost:3000/start");
  const data = await res.json();
  project.value = data.project;
  commits.value = data.commits;
});
</script>