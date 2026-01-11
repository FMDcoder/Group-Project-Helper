<template>
  <section class="page">
    <div class="page-header">
      <h2>
        Project Overview
        <!--{{ getCurrentProjectName() || "" }}-->
        <div class="edit-btn">
          <EditProjectBtn :model="model" />
        </div>
      </h2>
      <p class="subtitle">{{ projectSelected() ?
          "Manage deadlines, progress and meetings for the current project." :
          "Please select a project below to view the details." }}</p>
    </div>

    <div v-if="projectSelected()">
      <div class="layout">
        <!-- LEFT: Progress + deadlines -->
        <div class="card ">
          <div class="card-progress">
                <div class="card-header ">
                <h2 class="card-title">Progress</h2>
                <span class="badge">{{ getProgress() ?? 0 }}%</span>
                </div>
  
                <div class="progress-block">
                <!--div class="progress-row">
                <span class="label">Deadline</span>
                <span class="value">{{ project.deadline || "Not set" }}</span>
                </div-->
  
                <progress class="progress" :value="getProgress()" max="100"></progress>
                </div>
          </div>
          <div class="divider"></div>
          <div class="card-deadlines">
                <div class="card-header">
                <h3 class="card-title">Upcoming Deadlines</h3>
                </div>
  
                <div class="deadlines-list">
                <Deadlines :model="model" :current-project-only="true" />
                </div>
          </div>
          </div>

        <!-- RIGHT: Meetings -->
        <div class="card card-meetings">
          <div class="card-header">
            <h3 class="card-title">Meetings</h3>
          </div>

          <ul class="meetings">
            <li v-for="m in getProjectMeetings()" :key="m.id" class="meeting-item">
              <div class="meeting-main">
                <div class="meeting-title">{{ m.name }}</div>
                <div class="meeting-date">{{ formatMeetingTime(m.time) }}</div>
                <div class="meeting-date"><b>Place: </b>{{ m.place }}</div>
              </div>

              <div>
                <button class="btn btn-ghost" @click="openDeleteModal(m)">Delete</button>
                <div class="btn-spacer"></div>
                <button class="btn btn-primary" @click="editMeeting(m.id)">Edit</button>
              </div>
            </li>

            <li v-if="getProjectMeetings().length === 0" class="empty">
              No meetings yet. Add one below.
            </li>
          </ul>

          <div class="button-row">
            <button class="btn btn-primary" @click="openModal">Add meeting</button>
          </div>
        </div>
      </div>

      <!-- MODAL: Add meeting -->
      <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
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
              <span class="field-label">Place</span>
              <input v-model="newMeeting.place" type="text" placeholder="e.g., Zoom / Room B204" />
            </label>

            <label class="field">
              <span class="field-label">Date</span>
              <input v-model="newMeeting.date" type="date" />
            </label>

            <label class="field">
              <span class="field-label">Time</span>
              <input v-model="newMeeting.time" type="time" />
            </label>

            <p v-if="isAddDisabled" class="hint">
              Fill in name, place, date and time to enable Add.
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

      <!-- MODAL: Edit meeting -->
      <div v-if="showModalEdit" class="modal-backdrop" @click.self="closeModalEdit">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Edit meeting">
          <div class="modal-header">
            <h3 class="modal-title">Edit meeting</h3>
            <button class="btn btn-ghost" @click="closeModalEdit" aria-label="Close">✕</button>
          </div>

          <div class="modal-body">
            <label class="field">
              <span class="field-label">Name</span>
              <input
                ref="meetingEditNameInput"
                v-model="newMeeting.title"
                type="text"
                placeholder="e.g., Weekly check-in"
              />
            </label>

            <label class="field">
              <span class="field-label">Place</span>
              <input v-model="newMeeting.place" type="text" placeholder="e.g., Zoom / Room B204" />
            </label>

            <label class="field">
              <span class="field-label">Date</span>
              <input v-model="newMeeting.date" type="date" />
            </label>

            <label class="field">
              <span class="field-label">Time</span>
              <input v-model="newMeeting.time" type="time" />
            </label>

            <p v-if="isAddDisabled" class="hint">
              Fill in name, place, date and time to enable Edit.
            </p>
          </div>

          <div class="modal-actions">
            <button class="btn" @click="closeModalEdit">Cancel</button>
            <button
              class="btn btn-primary"
              @click="confirmEdit"
              :disabled="isAddDisabled"
              :aria-disabled="isAddDisabled"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL: Confirm delete -->
      <div v-if="showDeleteModal" class="modal-backdrop" @click.self="closeDeleteModal">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Confirm delete meeting">
          <div class="modal-header">
            <h3 class="modal-title">Delete meeting?</h3>
            <button class="btn btn-ghost" @click="closeDeleteModal" aria-label="Close">✕</button>
          </div>

          <div class="modal-body">
            <p class="hint" style="margin:0;">
              Are you sure you want to delete <b>{{ meetingToDelete?.name }}</b>?
              This action cannot be undone.
            </p>
          </div>

          <div class="modal-actions">
            <button class="btn" @click="closeDeleteModal">Cancel</button>
            <button class="btn btn-danger" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>

      <!-- MODAL: Confirm create time exists -->
      <div v-if="showConfirmModal" class="modal-backdrop" @click.self="closeConfirmModal">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Confirm create meeting">
          <div class="modal-header">
            <h3 class="modal-title">Double booking?</h3>
            <button class="btn btn-ghost" @click="closeConfirmModal" aria-label="Close">✕</button>
          </div>

          <div class="modal-body">
            <p class="hint" style="margin:0;">
              There is already a meeting planned for {{ "insert time" }},
              are you sure you want to create {{ "insert name" }}?
            </p>
          </div>

          <div class="modal-actions">
            <button class="btn" @click="closeConfirmModal">Cancel</button>
            <button v-if="showModal" class="btn btn-primary" @click="confirmCreateSameTime">Create</button>
            <button v-else class="btn btn-primary" @click="confirmUpdateSameTime">Edit</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card">
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
const showModalEdit = ref(false);

const showDeleteModal = ref(false);
const meetingToDelete = ref(null);

const showConfirmModal = ref(false);
const meetingToCreate = ref(null);

const newMeeting = ref({
  id: null,
  title: "",
  place: "",
  date: "",
  time: "",
});

const meetingNameInput = ref(null);
const meetingEditNameInput = ref(null);

const isAddDisabled = computed(() => {
  return (
    newMeeting.value.title.trim().length === 0 ||
    newMeeting.value.place.trim().length === 0 ||
    newMeeting.value.date.trim().length === 0 ||
    newMeeting.value.time.trim().length === 0
  );
});

let escHandler = null;
let escHandlerEdit = null;
let escHandlerDelete = null;
let escHandlerConfirm = null;
let escHandlerMemory = null;

function openModal() {
  showModal.value = true;

  nextTick(() => meetingNameInput.value?.focus?.());

  escHandler = (e) => {
    if (e.key === "Escape") closeModal();
  };
  window.addEventListener("keydown", escHandler);
}

function closeModal() {
  showModal.value = false;
  newMeeting.value = { id: null, title: "", place: "", date: "", time: "" };

  if (escHandler) {
    window.removeEventListener("keydown", escHandler);
    escHandler = null;
  }
}

function openModalEdit() {
  showModalEdit.value = true;

  nextTick(() => meetingEditNameInput.value?.focus?.());

  escHandlerEdit = (e) => {
    if (e.key === "Escape") closeModalEdit();
  };
  window.addEventListener("keydown", escHandlerEdit);
}

function closeModalEdit() {
  showModalEdit.value = false;
  newMeeting.value = { id: null, title: "", place: "", date: "", time: "" };

  if (escHandlerEdit) {
    window.removeEventListener("keydown", escHandlerEdit);
    escHandlerEdit = null;
  }
}

function combineDateTime(dateStr, timeStr) {
  // Example: 2026-01-10 + 22:00 -> 2026-01-10T22:00
  return `${dateStr}T${timeStr}`;
}

function confirmAdd() {
  if (isAddDisabled.value) return;

  const meetingDetails = {
    name: newMeeting.value.title,
    place: newMeeting.value.place,
    time: combineDateTime(newMeeting.value.date, newMeeting.value.time),
  };

  if (props.model.meetingTimeExists(meetingDetails)) {
    openConfirmModal(meetingDetails);
  }
  else {
    props.model.createMeeting(meetingDetails);
    closeModal();
  }
}

function confirmEdit() {
  if (isAddDisabled.value) return;

  const meetingDetails = {
    id: newMeeting.value.id,
    name: newMeeting.value.title,
    place: newMeeting.value.place,
    time: combineDateTime(newMeeting.value.date, newMeeting.value.time),
  };

  if (props.model.meetingTimeExists(meetingDetails)) {
    openConfirmModal(meetingDetails);
  }
  else {
    props.model.updateMeeting(meetingDetails);
    closeModalEdit();
  }
}

function toDateAndTime(isoLike) {
  const d = new Date(isoLike);
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
}

function editMeeting(id) {
  const currentMeeting = getProjectMeetings().find((m) => m.id === id);
  if (!currentMeeting) return;

  const dt = toDateAndTime(currentMeeting.time);

  newMeeting.value = {
    id,
    title: currentMeeting.name ?? "",
    place: currentMeeting.place ?? "",
    date: dt.date,
    time: dt.time,
  };

  openModalEdit();
}

function openDeleteModal(meeting) {
  meetingToDelete.value = meeting;
  showDeleteModal.value = true;

  escHandlerDelete = (e) => {
    if (e.key === "Escape") closeDeleteModal();
  };
  window.addEventListener("keydown", escHandlerDelete);
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  meetingToDelete.value = null;

  if (escHandlerDelete) {
    window.removeEventListener("keydown", escHandlerDelete);
    escHandlerDelete = null;
  }
}

function openConfirmModal(meeting) {
  meetingToCreate.value = meeting;
  showConfirmModal.value = true;

  if (showModal?.value && escHandler) {
    escHandlerMemory = escHandler;
    window.removeEventListener("keydown", escHandler);
    escHandler = null;
  }
  else if (showModalEdit?.value && escHandlerEdit) {
    escHandlerMemory = escHandlerEdit;
    window.removeEventListener("keydown", escHandlerEdit);
    escHandlerEdit = null;
  }

  escHandlerConfirm = (e) => {
    if (e.key === "Escape") closeConfirmModal();
  };
  window.addEventListener("keydown", escHandlerConfirm);
}

function closeConfirmModal() {
  showConfirmModal.value = false;
  meetingToCreate.value = null;

  if (escHandlerConfirm) {
    window.removeEventListener("keydown", escHandlerConfirm);
    escHandlerConfirm = null;
  }
  
  if (showModal?.value && escHandler == null) {
    escHandler = escHandlerMemory;
    window.addEventListener("keydown", escHandler);
    escHandlerMemory = null;
  }
  else if (showModalEdit?.value && escHandlerEdit == null) {
    escHandlerEdit = escHandlerMemory;
    window.addEventListener("keydown", escHandlerEdit);
    escHandlerMemory = null;
  }
}

function confirmCreateSameTime() {
  if (!meetingToCreate.value) return;

  if (showModal) props.model.createMeeting(meetingToCreate.value);

  closeConfirmModal();
  closeModal();
}

function confirmUpdateSameTime() {
  if (!meetingToCreate.value) return;

  if (showModalEdit) props.model.updateMeeting(meetingToCreate.value);

  closeConfirmModal();
  closeModalEdit();
}

function formatMeetingTime(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  // "Wed 11 Jan 2026"
  const day = d.toLocaleDateString("en-GB", { weekday: "short" }); // Wed
  const date = d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); // 11 Jan 2026

  // "16:00"
  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${day} ${date}, ${time}`;
}


async function confirmDelete() {
  if (!meetingToDelete.value) return;

  await props.model.deleteMeeting(meetingToDelete.value.id);

  // if you also keep local list
  meetings.value = meetings.value.filter((m) => m.id !== meetingToDelete.value.id);

  closeDeleteModal();
}

function projectSelected() {
  return props.model.getCurrentProject() != null;
}

function getCurrentProjectName() {
  return props.model.getCurrentProject()?.name;
}

function getProjectMeetings() {
  return props.model.getProjectMeetings();
}

function getProgress() {
  return props.model.getProjectProgress();
}

onBeforeUnmount(() => {
  if (escHandler) window.removeEventListener("keydown", escHandler);
  if (escHandlerEdit) window.removeEventListener("keydown", escHandlerEdit);
  if (escHandlerDelete) window.removeEventListener("keydown", escHandlerDelete);
  if (escHandlerConfirm) window.removeEventListener("keydown", escHandlerConfirm);
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
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
}

.card-progress {
  margin-top: -15px;
  background-color: #aebdf7;
  padding: 20px;
  border-radius: 16px;
}

.card-deadlines {
  border: 2px solid #aebdf7;
  padding: 20px;
  border-radius: 16px;
}

.card-meetings {
  background-color: #aebdf7;
  padding: 20px;
  border-radius: 16px;
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
  height: 32px;
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

div.btn-spacer {
  display: inline-block;
  width: 8px;
}

/* Danger button */
.btn-danger {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
}
.btn-danger:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

/* Disabled */
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  box-shadow: none;
  transform: none;
}

/* Edit button inside card */
div.edit-btn {
  float: right;
}

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
  border: 3px solid #e2e8f0;
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

/* Inputs */
input[type="text"],
input[type="date"],
input[type="time"] {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  box-sizing: border-box;
  height: 44px;
  background: #fff;
  appearance: none;
  -webkit-appearance: none;
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
