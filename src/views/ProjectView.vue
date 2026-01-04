<template>
  <section>
    <h1>Project Overview</h1>

    <p>Deadline: {{ project.deadline }}</p>
    <progress :value="project.progress" max="100"></progress>

    <h2>Möten</h2>
    <ul>
      <li v-for="m in meetings" :key="m.id">
        {{ m.title }} – {{ m.date }}
        <button @click="removeMeeting(m.id)">Ta bort</button>
      </li>
    </ul>

    <button @click="addMeeting">Lägg till möte</button>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const project = ref({});
const meetings = ref([]);

async function load() {
  const res = await fetch("http://localhost:3000/project");
  const data = await res.json();
  project.value = data.project;
  meetings.value = data.meetings;
}

async function addMeeting() {
  await fetch("http://localhost:3000/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "New Meeting", date: "2026-01-25" })
  });
  load();
}

async function removeMeeting(id) {
  await fetch(`http://localhost:3000/meetings/${id}`, {
    method: "DELETE"
  });
  load();
}

onMounted(load);
</script>
