<template>
  <section class="page">
    <div class="page-header">
      <h2>Task Board</h2>
      <p v-if="currentProjectId" class="subtitle">
        Manage tasks for: <b>{{ currentProjectName }}</b>
      </p>
      <p v-else class="subtitle">Select a project to view tasks.</p>
    </div>

    <div v-if="!currentProjectId" class="card">
      <div class="projects-wrapper">
        <UserProjects :model="props.model" :redirect="false" />
      </div>
    </div>

    <div v-else class="taskboard">
      <!-- TO DO -->
      <div class="column">
        <h2>To Do</h2>

        <div class="card-lite">
          <h3 class="mini-title">Add task</h3>

          <label class="field">
            <span class="field-label">Title</span>
            <input v-model.trim="newTask.name" type="text" placeholder="e.g., Create prototype sketches" />
          </label>

          <label class="field">
            <span class="field-label">Description</span>
            <input v-model.trim="newTask.description" type="text" placeholder="Short description" />
          </label>

          <label class="field">
            <span class="field-label">Deadline</span>
            <input v-model="newTask.deadline" type="datetime-local" />
          </label>

          <div class="actions">
            <button class="btn btn-primary" :disabled="isAddDisabled" @click="addTask">
              Add to To Do
            </button>
          </div>

          <p v-if="isAddDisabled" class="hint">Fill in title + description to enable Add.</p>
        </div>

        <div v-for="(t, index) in todoTasks" :key="t.id" class="task">
          <div class="task-header">
            <h3 class="task-title">{{ t.name }}</h3>
            <span class="badge todo">To Do</span>
          </div>

          <div class="task-fields">
            <div>
              <label>Description</label>
              <input type="text" :value="t.description || ''" readonly />
            </div>

            <div>
              <label>Deadline</label>
              <input type="text" :value="formatDeadline(t.deadline)" readonly />
            </div>

            <div>
              <label>Assigned to</label>
              <input type="text" :value="t.assignees || '—'" readonly />
            </div>
          </div>

          <div class="actions actions-3">
            <button class="btn" @click="handleAssignment(t.id)">{{ !props.model.isUserPartOfTask(t.id) ? "Assign to me" : "Unassign me" }}</button>
            <button class="btn" @click="openEdit(t)">Edit</button>
            <button class="btn btn-ghost" @click="openDelete(t)">Delete</button>
          </div>

          <div class="move-row">
            <button class="btn btn-primary" @click="moveTask(t.id, statusIds.inProgress)">Move to In Progress</button>
          </div>
        </div>
      </div>

      <!-- IN PROGRESS -->
      <div class="column">
        <h2>In Progress</h2>

        <div v-for="t in progressTasks" :key="t.id" class="task">
          <div class="task-header">
            <h3 class="task-title">{{ t.name }}</h3>
            <span class="badge progress">In Progress</span>
          </div>

          <div class="task-fields">
            <div>
              <label>Description</label>
              <input type="text" :value="t.description || ''" readonly />
            </div>

            <div>
              <label>Deadline</label>
              <input type="text" :value="formatDeadline(t.deadline)" readonly />
            </div>

            <div>
              <label>Assigned to</label>
              <input type="text" :value="t.assignees || '—'" readonly />
            </div>
          </div>

          <div class="actions actions-3">
            <button class="btn" @click="handleAssignment(t.id)">{{ !props.model.isUserPartOfTask(t.id) ? "Assign to me" : "Unassign me" }}</button>
            <button class="btn" @click="openEdit(t)">Edit</button>
            <button class="btn btn-ghost" @click="openDelete(t)">Delete</button>
          </div>

          <div class="move-row">
            <button class="btn" @click="moveTask(t.id, statusIds.todo)">Move to To Do</button>
            <button class="btn btn-primary" @click="moveTask(t.id, statusIds.done)">Move to Done</button>
          </div>
        </div>
      </div>

      <!-- DONE -->
      <div class="column">
        <h2>Done</h2>

        <div v-for="t in doneTasks" :key="t.id" class="task">
          <div class="task-header">
            <h3 class="task-title">{{ t.name }}</h3>
            <span class="badge done">Done</span>
          </div>

          <div class="task-fields">
            <div>
              <label>Description</label>
              <input type="text" :value="t.description || ''" readonly />
            </div>

            <div>
              <label>Deadline</label>
              <input type="text" :value="formatDeadline(t.deadline)" readonly />
            </div>

            <div>
              <label>Assigned to</label>
              <input type="text" :value="t.assignees || '—'" readonly />
            </div>
          </div>

          <div class="actions actions-3">
            <button class="btn" @click="handleAssignment(t.id)">{{ !props.model.isUserPartOfTask(t.id) ? "Assign to me" : "Unassign me" }}</button>
            <button class="btn" @click="openEdit(t)">Edit</button>
            <button class="btn btn-ghost" @click="openDelete(t)">Delete</button>
          </div>

          <div class="move-row">
            <button class="btn" @click="moveTask(t.id, statusIds.inProgress)">Move to In Progress</button>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEdit" class="modal-backdrop" @click.self="closeEdit">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Edit task">
        <div class="modal-header">
          <h3 class="modal-title">Edit task</h3>
          <button class="btn btn-ghost" @click="closeEdit" aria-label="Close">✕</button>
        </div>

        <div class="modal-body">
          <label class="field">
            <span class="field-label">Title</span>
            <input ref="editTitleInput" v-model.trim="editForm.name" type="text" />
          </label>

          <label class="field">
            <span class="field-label">Description</span>
            <input v-model.trim="editForm.description" type="text" />
          </label>

          <label class="field">
            <span class="field-label">Deadline</span>
            <input v-model="editForm.deadline" type="datetime-local" />
          </label>
        </div>

        <div class="modal-actions">
          <button class="btn" @click="closeEdit">Cancel</button>
          <button class="btn btn-primary" :disabled="isEditDisabled" @click="saveEdit">Save</button>
        </div>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div v-if="showDelete" class="modal-backdrop" @click.self="closeDelete">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Confirm delete task">
        <div class="modal-header">
          <h3 class="modal-title">Delete task?</h3>
          <button class="btn btn-ghost" @click="closeDelete" aria-label="Close">✕</button>
        </div>

        <div class="modal-body">
          <p class="hint" style="margin:0;">
            Are you sure you want to delete <b>{{ taskToDelete?.name }}</b>?
            This action cannot be undone.
          </p>
        </div>

        <div class="modal-actions">
          <button class="btn" @click="closeDelete">Cancel</button>
          <button class="btn btn-danger" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue";
import UserProjects from "@/components/UserProjects.vue";
//import { f } from "vue-router";
import { task } from "@/dat";
import { reactive } from 'vue'

const props = defineProps(["model"]);

const tasks = ref([]);
const statusIds = ref({ todo: null, inProgress: null, done: null });

const showEdit = ref(false);
const showDelete = ref(false);

const taskToDelete = ref(null);

const newTask = ref({
  name: "",
  description: "",
  deadline: "",
});

const editForm = ref({
  id: null,
  name: "",
  description: "",
  deadline: "",
});

const editTitleInput = ref(null);

const currentProjectId = computed(() => props.model.getCurrentProject()?.id ?? null);
const currentProjectName = computed(() => props.model.getCurrentProject()?.name ?? null);

const todoTasks = computed(() => tasks.value.filter(t => t.statusId === statusIds.value.todo));
const progressTasks = computed(() => tasks.value.filter(t => t.statusId === statusIds.value.inProgress));
const doneTasks = computed(() => tasks.value.filter(t => t.statusId === statusIds.value.done));

const isAddDisabled = computed(() => {
  return newTask.value.name.trim().length === 0 || newTask.value.description.trim().length === 0;
});

const isEditDisabled = computed(() => {
  return editForm.value.name.trim().length === 0 || editForm.value.description.trim().length === 0;
});

let escEdit = null;
let escDelete = null;

const getAssignedTask = (id) => {
  return assignedTaskslist.find(v => v.id == id)
}
function loadBoard() {
  if (!currentProjectId.value) {
    tasks.value = [];
    return;
  }

  statusIds.value = {
    todo: props.model.getStatusIdByName("To do"),
    inProgress: props.model.getStatusIdByName("In progress"),
    done: props.model.getStatusIdByName("Done"),
  };

  tasks.value = props.model.getProjectTasksForBoard();
}

watch(currentProjectId, () => loadBoard(), { immediate: true });

function toPretty(dt) {
  if (!dt) return "";
  const d = dt instanceof Date ? dt : new Date(dt);
  if (Number.isNaN(d.getTime())) return String(dt);

  const date = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

  return `${date}, ${time}`;
}

function formatDeadline(deadline) {
  return deadline ? toPretty(deadline) : "—";
}

function addTask() {
  if (isAddDisabled.value) return;

  props.model.createTask({
    name: newTask.value.name,
    description: newTask.value.description,
    deadline: newTask.value.deadline || null,
    statusId: statusIds.value.todo,
  });

  newTask.value = { name: "", description: "", deadline: "" };
  loadBoard();
}

function openEdit(task) {
  showEdit.value = true;

  editForm.value = {
    id: task.id,
    name: task.name ?? "",
    description: task.description ?? "",
    deadline: task.deadline ? props.model.toDatetimeLocal(task.deadline) : "",
  };

  nextTick(() => editTitleInput.value?.focus?.());

  escEdit = (e) => {
    if (e.key === "Escape") closeEdit();
  };
  window.addEventListener("keydown", escEdit);
}

function closeEdit() {
  showEdit.value = false;
  editForm.value = { id: null, name: "", description: "", deadline: "" };

  if (escEdit) {
    window.removeEventListener("keydown", escEdit);
    escEdit = null;
  }
}

function saveEdit() {
  if (isEditDisabled.value) return;

  props.model.updateTask({
    id: editForm.value.id,
    name: editForm.value.name,
    description: editForm.value.description,
    deadline: editForm.value.deadline || null,
  });

  closeEdit();
  loadBoard();
}

function openDelete(task) {
  taskToDelete.value = task;
  showDelete.value = true;

  escDelete = (e) => {
    if (e.key === "Escape") closeDelete();
  };
  window.addEventListener("keydown", escDelete);
}

function closeDelete() {
  showDelete.value = false;
  taskToDelete.value = null;

  if (escDelete) {
    window.removeEventListener("keydown", escDelete);
    escDelete = null;
  }
}

function confirmDelete() {
  if (!taskToDelete.value) return;
  props.model.deleteTask(taskToDelete.value.id);
  closeDelete();
  loadBoard();
}

function handleAssignment(taskid) {
  if(!props.model.isUserPartOfTask(taskid)) {
    assignToMe(taskid)
    updateAssignedTasklist(taskid, true)
  }
  else {
    unAssignUserFromTask(taskid)
    updateAssignedTasklist(taskid, false)
  }
  props.model.notifyObservers()
}

function unAssignUserFromTask(taskid) {
    props.model.unassignTaskFromCurrentUser(taskid)
    loadBoard()
}

function assignToMe(taskId) {
  props.model.assignTaskToCurrentUser(taskId);
  loadBoard();
}

function moveTask(taskId, newStatusId) {
  props.model.updateTaskStatus(taskId, newStatusId);
  loadBoard();
}

onBeforeUnmount(() => {
  if (escEdit) window.removeEventListener("keydown", escEdit);
  if (escDelete) window.removeEventListener("keydown", escDelete);
});
</script>

<style scoped>
* { box-sizing: border-box; }

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px;
}

.page-header { margin-bottom: 14px; }

.subtitle { margin: 6px 0 0 0; color: #64748b; }

.card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
}

.taskboard {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.column {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  min-height: 520px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}

.column h2 {
  margin: 0 0 12px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef2f7;
  font-size: 18px;
}

.card-lite {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  background: #f8fafc;
  margin-bottom: 14px;
}

.mini-title {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 900;
  color: #0f172a;
}

.task {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  background: #ffffff;
  margin-bottom: 14px;
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.task-title {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
}

.task-fields > div { margin-bottom: 10px; }

label {
  display: block;
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 4px;
}

.field {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}

.field-label {
  font-size: 12px;
  font-weight: 800;
  color: #334155;
}

input[type="text"],
input[type="date"],
input[type="time"],
input[type="datetime-local"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  font-size: 14px;
  height: 44px;
}

input[readonly] { background: #f1f5f9; }

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.actions-3 { flex-wrap: wrap; }

.move-row {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  box-shadow: none;
  transform: none;
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
}

.btn-ghost:hover {
  background: rgba(37, 99, 235, 0.14);
  border-color: transparent;
  transform: none;
  box-shadow: none;
}

.btn-danger {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid #e2e8f0;
}

.badge.todo { background: rgba(37, 99, 235, 0.12); color: #1d4ed8; }
.badge.progress { background: rgba(245, 158, 11, 0.16); color: #b45309; }
.badge.done { background: rgba(34, 197, 94, 0.16); color: #15803d; }

.hint {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #64748b;
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 16px 16px;
}

@media (max-width: 1000px) {
  .taskboard { flex-direction: column; }
}
</style>
