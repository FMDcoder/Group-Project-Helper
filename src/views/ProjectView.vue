<template>
  <section class="page">
    <div v-if="projectSelected()">
      <div class="page-header">
        <h1>Project Overview</h1>
        <p class="subtitle">Manage deadlines, progress and meetings for the current project.</p>
      </div>

      <div class="layout">
        <!-- LEFT: Progress + deadlines -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Progress</h2>
            <span class="badge">{{ project.progress ?? 0 }}%</span>
          </div>

          <div class="progress-block">
            <div class="progress-row">
              <span class="label">Deadline</span>
              <span class="value">{{ project.deadline || "Not set" }}</span>
            </div>

            <progress class="progress" :value="project.progress" max="100"></progress>
          </div>

          <div class="divider"></div>

          <div class="card-header">
            <h2 class="card-title">Upcoming Deadlines</h2>
          </div>

          <div class="deadlines-list">
            <Deadlines :model="model" :current-project-only="true" />
          </div>
        </div>

        <!-- RIGHT: Meetings -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Meetings</h2>
          </div>

          <ul class="meetings">
            <li v-for="m in getProjectMeetings()" :key="m.id" class="meeting-item">
              <div class="meeting-main">
                <div class="meeting-title">{{ m.name }}</div>
                <div class="meeting-date">{{ m.time }}</div>
              </div>

              <button class="btn btn-ghost" @click="removeMeeting(m.id)">Delete</button>
            </li>

            <li v-if="getProjectMeetings().length === 0" class="empty">
              No meetings yet. Add one below.
            </li>
          </ul>

          <div class="button-row">
            <button class="btn btn-primary" @click="openModal">Add meeting</button>
            <div class="edit-btn">
              <EditProjectBtn :model="model" />
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Add meeting">
          <div class="modal-header">
            <h3 class="modal-title">New meeting</h3>
            <button class="btn btn-ghost" @click="closeModal" aria-label="Close">✕</button>
          </div>

          <div class="modal-body">
            <label class="field">
              <span class="field-label">Name</span>
              <input
                ref="meetingNameInput"
                v-model="newMeeting.title"
                type="text"
                placeholder="e.g., Weekly check-in"
              />
            </label>

            <label class="field">
              <span class="field-label">Date</span>
              <input v-model="newMeeting.date" type="date" />
            </label>

            <p v-if="isAddDisabled" class="hint">
              Fill in both name and date to enable Add.
            </p>
          </div>

          <div class="modal-actions">
            <button class="btn" @click="closeModal">Cancel</button>

            <button
              class="btn btn-primary"
              @click="confirmAdd"
              :disabled="isAddDisabled"
              :aria-disabled="isAddDisabled"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card">
      <h1>Select a project</h1>
      <p class="subtitle">Please select one of your projects below to view its details.</p>
      <div class="projects-wrapper">
        <UserProjects :model="props.model" :redirect="false" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick, onBeforeUnmount } from "vue";
import EditProjectBtn from "./../components/EditProject.vue";
import Deadlines from "@/components/Deadlines.vue";
import UserProjects from "@/components/UserProjects.vue";

const props = defineProps(["model"]);

const project = ref({});
const meetings = ref([]);
const showModal = ref(false);
const newMeeting = ref({ title: "", date: "" });

/* ✅ Autofocus reference */
const meetingNameInput = ref(null);

/* ✅ Disable Add until valid */
const isAddDisabled = computed(() => {
  return (
    newMeeting.value.title.trim().length === 0 ||
    newMeeting.value.date.trim().length === 0
  );
});

/* ✅ ESC handler */
let escHandler = null;

function openModal() {
  showModal.value = true;

  // Autofocus on Name
  nextTick(() => {
    meetingNameInput.value?.focus?.();
  });

  // Close with ESC
  escHandler = (e) => {
    if (e.key === "Escape") closeModal();
  };
  window.addEventListener("keydown", escHandler);
}

function closeModal() {
  showModal.value = false;
  newMeeting.value = { title: "", date: "" };

  if (escHandler) {
    window.removeEventListener("keydown", escHandler);
    escHandler = null;
  }
}

function confirmAdd() {
  if (isAddDisabled.value) return;

  meetings.value.push({
    id: Date.now(),
    title: newMeeting.value.title,
    date: newMeeting.value.date,
  });

  closeModal();
}

function removeMeeting(id) {
  meetings.value = meetings.value.filter((m) => m.id !== id);
}

function projectSelected() {
  return props.model.getCurrentProject() != null;
}

function getProjectMeetings() {
  return props.model.getProjectMeetings()
}

onBeforeUnmount(() => {
  if (escHandler) window.removeEventListener("keydown", escHandler);
});

</script>

<style scoped>
/* Page */
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px;
}

.page-header {
  margin-bottom: 14px;
}

.subtitle {
  margin: 6px 0 0 0;
  color: #64748b;
}

/* Layout */
.layout {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 18px;
  align-items: start;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

/* Card */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
}

.card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.card-title {
  margin: 0;
  font-size: 20px;
  letter-spacing: -0.02em;
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  background: #f1f5f9;
  color: #334155;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

/* Progress block */
.progress-block {
  display: grid;
  gap: 10px;
}

.progress-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #334155;
  font-size: 14px;
}

.label {
  color: #64748b;
  font-weight: 700;
}

.value {
  font-weight: 700;
}

/* progress bar */
.progress {
  width: 100%;
  height: 14px;
}

/* Divider */
.divider {
  height: 1px;
  background: #eef2f7;
  margin: 14px 0;
}

/* Meetings list */
.meetings {
  list-style: none;
  padding: 0;
  margin: 0;
}

.meeting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  margin: 10px 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
}

.meeting-main {
  display: grid;
  gap: 2px;
}

.meeting-title {
  font-weight: 800;
  color: #0f172a;
}

.meeting-date {
  font-size: 13px;
  color: #64748b;
}

.empty {
  padding: 10px 12px;
  margin-top: 8px;
  color: #64748b;
}

/* Buttons */
.button-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.btn {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}

.btn:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
}

.btn-primary {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn-ghost {
  background: transparent;
  border-color: transparent;
  color: #0f172a;
}

.btn-ghost:hover {
  background: rgba(37, 99, 235, 0.14);
  border-color: transparent;
  box-shadow: none;
  transform: none;
}

/* Disabled */
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  box-shadow: none;
  transform: none;
}

/* Edit button inside card */
.edit-btn :deep(button) {
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
}

/* Deadlines list */
.deadlines-list :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.deadlines-list :deep(li) {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin: 10px 0;
  background: #ffffff;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.deadlines-list :deep(li:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
  background: #f8fafc;
}

.deadlines-list :deep(a) {
  color: #0f172a;
  text-decoration: none;
  font-weight: 800;
}

.deadlines-list :deep(a:hover) {
  text-decoration: underline;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 9999;
}

.modal {
  width: 520px;
  max-width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.25);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 16px 10px;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.modal-body {
  padding: 10px 16px 16px;
  display: grid;
  gap: 12px;
}

.field {
  display: grid;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 800;
  color: #334155;
}

input[type="text"],
input[type="date"] {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 16px 16px;
}

/* Hint text */
.hint {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}
</style>
