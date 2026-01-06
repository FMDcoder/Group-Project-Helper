<template>
  <section id="app">
    <h1>Task Board Screen</h1>

    <div class="taskboard">
      <!-- ===================== TO DO COLUMN ===================== -->
      <div class="column">
        <h2>To Do</h2>

        <!-- Add Task (UI only) -->
        <div class="add-task">
          <h3>Add Task</h3>

          <div>
            <label>Title</label>
            <input type="text" placeholder="e.g., Create prototype sketches" />
          </div>

          <div>
            <label>Description</label>
            <input type="text" placeholder="Short description" />
          </div>

          <div>
            <label>Deadline</label>
            <input type="date" />
          </div>

          <div class="actions">
            <button type="button">Add to To Do</button>
          </div>
        </div>

        <!-- Example Task -->
        <div class="task">
          <div class="task-header">
            <h3 class="task-title">Design prototype</h3>
            <span class="badge todo">To Do</span>
          </div>

          <div class="task-fields">
            <div>
              <label>Description</label>
              <input
                type="text"
                value="Create low-fi sketches + short explanation text"
                readonly
              />
            </div>

            <div>
              <label>Deadline</label>
              <input type="text" value="Dec 12" readonly />
            </div>

            <div>
              <label>Assigned to</label>
              <input type="text" value="Oskar, Ali" readonly />
            </div>
          </div>

          <div class="actions">
            <button type="button">Assign to me</button>
            <button type="button">Edit</button>
            <button type="button">Delete</button>
          </div>
        </div>
      </div>

      <!-- ===================== IN PROGRESS COLUMN ===================== -->
      <div class="column">
        <h2>In Progress</h2>

        <div class="task">
          <div class="task-header">
            <h3 class="task-title">Write report introduction</h3>
            <span class="badge progress">In Progress</span>
          </div>

          <div class="task-fields">
            <div>
              <label>Description</label>
              <input
                type="text"
                value="Problem + motivation + target users + context"
                readonly
              />
            </div>

            <div>
              <label>Deadline</label>
              <input type="text" value="Dec 14" readonly />
            </div>

            <div>
              <label>Assigned to</label>
              <input type="text" value="Emma" readonly />
            </div>
          </div>

          <div class="actions">
            <button type="button">Assign to me</button>
            <button type="button">Edit</button>
            <button type="button">Delete</button>
          </div>
        </div>
      </div>

      <!-- ===================== DONE COLUMN ===================== -->
      <div class="column">
        <h2>Done</h2>

        <div class="task">
          <div class="task-header">
            <h3 class="task-title">Create personas</h3>
            <span class="badge done">Done</span>
          </div>

          <div class="task-fields">
            <div>
              <label>Description</label>
              <input
                type="text"
                value="4 personas + scenarios for the report"
                readonly
              />
            </div>

            <div>
              <label>Deadline</label>
              <input type="text" value="Dec 8" readonly />
            </div>

            <div>
              <label>Assigned to</label>
              <input type="text" value="Mohammed, Joel" readonly />
            </div>
          </div>

          <div class="actions">
            <button type="button" disabled>Completed</button>
            <button type="button">Edit</button>
            <button type="button">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- THREADS -->
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
  const res = await fetch(document.location.origin + "/taskboard");
  const data = await res.json();
  columns.value = data.columns;
  threads.value = data.threads;
}

async function addThread() {
  await fetch(document.location.origin + "/threads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "New Thread" }),
  });
  load();
}

async function removeThread(id) {
  await fetch(document.location.origin + `/threads/${id}`, {
    method: "DELETE",
  });
  load();
}

onMounted(load);
</script>

<style scoped>
* {
  box-sizing: border-box;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin: 0 0 16px 0;
}

/* Board layout */
.taskboard {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* Columns */
.column {
  flex: 1;
  background: #ffffff;
  border: 1px solid #d7dbe3;
  border-radius: 10px;
  padding: 14px;
  min-height: 500px;
}

.column h2 {
  margin: 0 0 12px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eceff4;
  font-size: 18px;
}

/* Add task box */
.add-task {
  border: 1px solid #cfd6e0;
  border-radius: 10px;
  padding: 12px;
  background: #fafbfc;
  margin-bottom: 14px;
}

.add-task h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
}

/* Task cards */
.task {
  border: 1px solid #cfd6e0;
  border-radius: 10px;
  padding: 12px;
  background: #ffffff;
  margin-bottom: 14px;
}

.task > div,
.add-task > div {
  margin-bottom: 10px;
}

label {
  display: block;
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 4px;
}

input[type="text"],
input[type="date"] {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cfd6e0;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
}

input[readonly] {
  background: #f1f5f9;
}

button {
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #cfd6e0;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #f3f4f6;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
