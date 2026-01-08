<template>
  <section>
    <div v-if="projectSelected()">
      <h1>Project Overview</h1>

      <p>Deadline: {{ project.deadline }}</p>
      <progress :value="project.progress" max="100"></progress>

      <Deadlines :model="model" :current-project-only="true" />
      <h2>Möten</h2>
      <ul>
        <li v-for="m in meetings" :key="m.id">
          {{ m.title }} – {{ m.date }}
          <button @click="removeMeeting(m.id)">Ta bort</button>
        </li>
      </ul>

      <button @click="openModal">Lägg till möte</button>

      <!-- MODAL -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal">
          <h3>Nytt möte</h3>
      
          <label>
            Namn
            <input v-model="newMeeting.title" type="text" />
          </label>
      
          <label>
            Deadline
            <input v-model="newMeeting.date" type="date" />
          </label>
      
          <div class="modal-actions">
            <button @click="confirmAdd">OK</button>
            <button @click="closeModal">Avbryt</button>
          </div>
        </div>
      </div>

      <EditProjectBtn :model="model" />
    </div>
    <div v-else>
      <h1>Select a project</h1>
      <h3>Please select one of Your projects below to view its details</h3>
      <UserProjects :model="props.model" :redirect="false" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import EditProjectBtn from "./../components/EditProject.vue"
import Deadlines from "@/components/Deadlines.vue";
import UserProjects from "@/components/UserProjects.vue";

const props = defineProps(['model']);

const project = ref({});
const meetings = ref([]);
const showModal = ref(false);
const newMeeting = ref({
  title: "",
  date: ""
});

function openModal() {
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  newMeeting.value = { title: "", date: "" };
}

function confirmAdd() {
  if (!newMeeting.value.title || !newMeeting.value.date) return;

  meetings.value.push({
    id: Date.now(),           // simple unique id
    title: newMeeting.value.title,
    date: newMeeting.value.date
  });

  closeModal();
}

function projectSelected() {
  return props.model.getCurrentProject() != null;
}



/*async function load() {
  const res = await fetch(document.location.origin+"/project");
  const data = await res.json();
  project.value = data.project;
  meetings.value = data.meetings;
}

async function addMeeting() {
  await fetch(document.location.origin+"/meetings", {
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

onMounted(load);*/




</script>
<style scoped>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    width: 300px;
  }
  
  .modal h3 {
    margin-top: 0;
  }
  
  .modal label {
    display: block;
    margin-bottom: 0.75rem;
  }
  
  .modal input {
    width: 100%;
    padding: 0.4rem;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  </style>
  