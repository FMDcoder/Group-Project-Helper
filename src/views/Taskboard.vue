<template>
  <section>
    <h1>Taskboard</h1>

    <div v-for="col in columns" :key="col.id">
      <h2>{{ col.name }}</h2>

      <div v-for="task in col.tasks" :key="task.id">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <p>{{ task.deadline }}</p>
        <button>Assignera mig själv</button>
      </div>
    </div>

    <h2>Trådar</h2>
    <ul>
      <li v-for="t in threads" :key="t.id">
        {{ t.name }}
        <button @click="removeThread(t.id)">Ta bort</button>
      </li>
    </ul>

    <button @click="addThread">Lägg till tråd</button>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const columns = ref([]);
const threads = ref([]);

async function load() {
  const res = await fetch(document.location.origin+"/taskboard");
  const data = await res.json();
  columns.value = data.columns;
  threads.value = data.threads;
}

async function addThread() {
  await fetch(document.location.origin+"/threads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "New Thread" })
  });
  load();
}

async function removeThread(id) {
  await fetch(document.location.origin+`/threads/${id}`, {
    method: "DELETE"
  });
  load();
}

onMounted(load);
</script>
