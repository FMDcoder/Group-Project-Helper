<template>
  <section class="page">
    <div class="page-header">
      <h2>Task Board</h2>
      <p v-if="currentProjectId" class="subtitle">
        Manage tasks for: <b>{{ currentProjectName }}</b>
      </p>
      <p v-else class="subtitle">Select a project to view tasks.</p>
    </div>

    <div v-if="!currentProjectId" class="layout">
      <div class="card card-temp">
        <div class="projects-wrapper">
          <UserProjects :model="props.model" :redirect="false" />
        </div>
      </div>
    </div>

    <div v-else class="taskboard">
      <!-- TO DO -->
      <div
        class="column"
        @dragover.prevent="onDragOver(statusIds.todo)"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop(statusIds.todo)"
        :class="{ dropzone: dragOverStatusId === statusIds.todo }"
      >
        <div class="col-head">
          <h2>To Do ({{ todoTasks.length }})</h2>

          <button class="btn btn-primary btn-small" @click="toggleAdd">
            {{ showAdd ? "Close" : "+ Add task" }}
          </button>
        </div>

        <p v-if="showDragHint" class="drag-hint">Drag to move</p>

        <div v-if="!showAdd && todoTasks.length === 0" class="empty-state">
          <span class="empty-title">No tasks yet</span>
          <button class="empty-link" type="button" @click="toggleAdd">Add a task</button>
        </div>

        <div v-if="showAdd" class="card-lite">
          <h3 class="mini-title">Add task</h3>

          <label class="field">
            <span class="field-label">Title</span>
            <input
              v-model.trim="newTask.name"
              type="text"
              placeholder="e.g., Create prototype sketches"
            />
          </label>

          <label class="field">
            <span class="field-label">Description</span>
            <input v-model.trim="newTask.description" type="text" placeholder="Short description" />
          </label>

          <div class="field-row">
            <label class="field">
              <span class="field-label">Date</span>
              <input v-model="newTask.date" type="date" />
            </label>

            <label class="field">
              <span class="field-label">Time</span>
              <input v-model="newTask.time" type="time" />
            </label>
          </div>

          <div class="actions">
            <button class="btn" @click="closeAdd">Cancel</button>
            <button class="btn btn-primary" :disabled="isAddDisabled" @click="addTask">
              Add to To Do
            </button>
          </div>

          <p v-if="isAddDisabled" class="hint">Fill in title + description to enable Add.</p>
        </div>

        <div
          v-for="t in todoTasks"
          :key="String(t.id)"
          class="task compact"
          draggable="true"
          @dragstart="onDragStart(t)"
          @dragend="onDragEnd"
          :class="{ open: isTaskOpen(t.id) }"
        >
          <div
            class="task-header clickableHead"
            role="button"
            tabindex="0"
            :aria-expanded="isTaskOpen(t.id)"
            :data-task-id="String(t.id)"
            @click="toggleTask(t.id)"
            @keydown="handleTaskKey($event, t.id)"
          >
            <div class="head-left">
              <span class="caret" :class="{ open: isTaskOpen(t.id) }">▸</span>
              <h3 class="task-title">{{ t.name }}</h3>
            </div>
            <span class="badge todo">To Do</span>
          </div>

          <div v-if="isTaskOpen(t.id)" class="task-body">
            <div class="task-compact">
              <p class="task-desc" v-if="t.description">{{ t.description }}</p>

              <div class="task-meta">
                <div class="meta-row">
                  <span class="meta-label">Deadline</span>
                  <span class="meta-value">{{ formatDeadline(t.deadline) }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Assigned</span>
                  <span class="meta-value">{{ t.assignees || "—" }}</span>
                </div>
              </div>
            </div>

            <div class="actions actions-3">
              <button
                class="btn"
                :class="{ assigned: props.model.isUserPartOfTask(t.id) }"
                @click.stop="handleAssignment(t.id)"
              >
                {{ !props.model.isUserPartOfTask(t.id) ? "Assign to me" : "Unassign me" }}
              </button>

              <button class="btn" @click.stop="openEdit(t)">Edit</button>
              <button class="btn btn-ghost" @click.stop="openDelete(t)">Delete</button>
            </div>

            <div class="move-row">
              <button class="btn btn-primary" @click.stop="moveTask(t.id, statusIds.inProgress)">
                Move to In Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- IN PROGRESS -->
      <div
        class="column"
        @dragover.prevent="onDragOver(statusIds.inProgress)"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop(statusIds.inProgress)"
        :class="{ dropzone: dragOverStatusId === statusIds.inProgress }"
      >
        <h2>In Progress ({{ progressTasks.length }})</h2>
        <p v-if="showDragHint" class="drag-hint">Drag to move</p>
        <div v-if="progressTasks.length === 0" class="empty-state">
          <span class="empty-title">Nothing in progress</span>
          <span class="empty-text">Drag a task here</span>
        </div>

        <div
          v-for="t in progressTasks"
          :key="String(t.id)"
          class="task compact"
          draggable="true"
          @dragstart="onDragStart(t)"
          @dragend="onDragEnd"
          :class="{ open: isTaskOpen(t.id) }"
        >
          <div
            class="task-header clickableHead"
            role="button"
            tabindex="0"
            :aria-expanded="isTaskOpen(t.id)"
            :data-task-id="String(t.id)"
            @click="toggleTask(t.id)"
            @keydown="handleTaskKey($event, t.id)"
          >
            <div class="head-left">
              <span class="caret" :class="{ open: isTaskOpen(t.id) }">▸</span>
              <h3 class="task-title">{{ t.name }}</h3>
            </div>
            <span class="badge progress">In Progress</span>
          </div>

          <div v-if="isTaskOpen(t.id)" class="task-body">
            <div class="task-compact">
              <p class="task-desc" v-if="t.description">{{ t.description }}</p>

              <div class="task-meta">
                <div class="meta-row">
                  <span class="meta-label">Deadline</span>
                  <span class="meta-value">{{ formatDeadline(t.deadline) }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Assigned</span>
                  <span class="meta-value">{{ t.assignees || "—" }}</span>
                </div>
              </div>
            </div>

            <div class="actions actions-3">
              <button
                class="btn"
                :class="{ assigned: props.model.isUserPartOfTask(t.id) }"
                @click.stop="handleAssignment(t.id)"
              >
                {{ !props.model.isUserPartOfTask(t.id) ? "Assign to me" : "Unassign me" }}
              </button>

              <button class="btn" @click.stop="openEdit(t)">Edit</button>
              <button class="btn btn-ghost" @click.stop="openDelete(t)">Delete</button>
            </div>

            <div class="move-row in-progress">
              <button class="btn" @click.stop="moveTask(t.id, statusIds.todo)">Move to To Do</button>
              <button class="btn btn-primary" @click.stop="moveTask(t.id, statusIds.done)">
                Move to Done
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- DONE -->
      <div
        class="column"
        @dragover.prevent="onDragOver(statusIds.done)"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop(statusIds.done)"
        :class="{ dropzone: dragOverStatusId === statusIds.done }"
      >
        <h2>Done ({{ doneTasks.length }})</h2>
        <p v-if="showDragHint" class="drag-hint">Drag to move</p>
        <div v-if="doneTasks.length === 0" class="empty-state">
          <span class="empty-title">No completed tasks</span>
          <span class="empty-text">Drag a task here</span>
        </div>

        <div
          v-for="t in doneTasks"
          :key="String(t.id)"
          class="task compact"
          draggable="true"
          @dragstart="onDragStart(t)"
          @dragend="onDragEnd"
          :class="{ open: isTaskOpen(t.id) }"
        >
          <div
            class="task-header clickableHead"
            role="button"
            tabindex="0"
            :aria-expanded="isTaskOpen(t.id)"
            :data-task-id="String(t.id)"
            @click="toggleTask(t.id)"
            @keydown="handleTaskKey($event, t.id)"
          >
            <div class="head-left">
              <span class="caret" :class="{ open: isTaskOpen(t.id) }">▸</span>
              <h3 class="task-title">{{ t.name }}</h3>
            </div>
            <span class="badge done">Done</span>
          </div>

          <div v-if="isTaskOpen(t.id)" class="task-body">
            <div class="task-compact">
              <p class="task-desc" v-if="t.description">{{ t.description }}</p>

              <div class="task-meta">
                <div class="meta-row">
                  <span class="meta-label">Deadline</span>
                  <span class="meta-value">{{ formatDeadline(t.deadline) }}</span>
                </div>
                <div class="meta-row">
                  <span class="meta-label">Assigned</span>
                  <span class="meta-value">{{ t.assignees || "—" }}</span>
                </div>
              </div>
            </div>

            <div class="actions actions-3">
              <button
                class="btn"
                :class="{ assigned: props.model.isUserPartOfTask(t.id) }"
                @click.stop="handleAssignment(t.id)"
              >
                {{ !props.model.isUserPartOfTask(t.id) ? "Assign to me" : "Unassign me" }}
              </button>

              <button class="btn" @click.stop="openEdit(t)">Edit</button>
              <button class="btn btn-ghost" @click.stop="openDelete(t)">Delete</button>
            </div>

            <div class="move-row">
              <button class="btn" @click.stop="moveTask(t.id, statusIds.inProgress)">
                Move to In Progress
              </button>
            </div>
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
            <span class="field-label">Date</span>
            <input v-model="editForm.date" type="date" />
          </label>

          <label class="field">
            <span class="field-label">Time</span>
            <input v-model="editForm.time" type="time" />
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

    <div class="toast" :class="{ show: toast.show }" role="status" aria-live="polite">
      {{ toast.message }}
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import UserProjects from "@/components/UserProjects.vue";

const props = defineProps(["model"]);

const tasks = ref([]);
const statusIds = ref({ todo: null, inProgress: null, done: null });

const showAdd = ref(false);

const showEdit = ref(false);
const showDelete = ref(false);

const dragHintKey = "taskboard:drag-hint:seen";
const showDragHint = ref(true);

const taskToDelete = ref(null);

const toast = ref({ show: false, message: "" });
let toastTimer = null;

const newTask = ref({
  name: "",
  description: "",
  date: "",
  time: "",
});

const editForm = ref({
  id: null,
  name: "",
  description: "",
  date: "",
  time: "",
});

const editTitleInput = ref(null);

const currentProjectId = computed(() => props.model.getCurrentProject()?.id ?? null);
const currentProjectName = computed(() => props.model.getCurrentProject()?.name ?? null);

/* ✅ Normalize ids so "1" and 1 behave the same */
const normId = (id) => String(id);

/* ✅ sessionStorage key per project */
const openStateKey = computed(() =>
  currentProjectId.value ? `taskboard:open:${currentProjectId.value}` : "taskboard:open:none"
);

function saveOpenState() {
  try {
    const arr = Array.from(expandedTaskIds.value);
    sessionStorage.setItem(openStateKey.value, JSON.stringify(arr));
  } catch (e) {}
}

function restoreOpenState() {
  try {
    const raw = sessionStorage.getItem(openStateKey.value);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.map(normId));
  } catch (e) {
    return new Set();
  }
}

/* ✅ MULTI-OPEN DROPDOWN STATE (PERSISTED) */
const expandedTaskIds = ref(restoreOpenState());

function isTaskOpen(id) {
  return expandedTaskIds.value.has(normId(id));
}

function toggleTask(id) {
  const key = normId(id);
  const next = new Set(expandedTaskIds.value);

  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }

  expandedTaskIds.value = next;
  saveOpenState();
}

const todoTasks = computed(() => tasks.value.filter((t) => t.statusId === statusIds.value.todo));
const progressTasks = computed(() => tasks.value.filter((t) => t.statusId === statusIds.value.inProgress));
const doneTasks = computed(() => tasks.value.filter((t) => t.statusId === statusIds.value.done));

const isAddDisabled = computed(() => {
  return newTask.value.name.trim().length === 0 || newTask.value.description.trim().length === 0;
});

const isEditDisabled = computed(() => {
  return editForm.value.name.trim().length === 0 || editForm.value.description.trim().length === 0;
});

let escEdit = null;
let escDelete = null;
let globalKeyHandler = null;

function loadBoard() {
  if (!currentProjectId.value) {
    tasks.value = [];
    expandedTaskIds.value = new Set();
    try { sessionStorage.removeItem(openStateKey.value); } catch (e) {}
    return;
  }

  statusIds.value = {
    todo: props.model.getStatusIdByName("To do"),
    inProgress: props.model.getStatusIdByName("In progress"),
    done: props.model.getStatusIdByName("Done"),
  };

  tasks.value = props.model.getProjectTasksForBoard();

  // Restore open state (covers rerenders/remounts)
  expandedTaskIds.value = restoreOpenState();

  // Prune open tasks that no longer exist
  const existing = new Set(tasks.value.map((t) => normId(t.id)));
  const nextOpen = new Set();
  expandedTaskIds.value.forEach((id) => {
    if (existing.has(id)) nextOpen.add(id);
  });
  expandedTaskIds.value = nextOpen;
  saveOpenState();

}

watch(currentProjectId, () => loadBoard(), { immediate: true });

onMounted(() => {
  globalKeyHandler = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (isEditableTarget(e.target)) return;
    if (showEdit.value || showDelete.value) return;

    const active = document.activeElement;
    if (active?.classList?.contains("clickableHead")) return;

    if (focusFirstTaskHeader()) {
      e.preventDefault();
    }
  };
  window.addEventListener("keydown", globalKeyHandler);
});

function toggleAdd() {
  showAdd.value = !showAdd.value;
}

function closeAdd() {
  showAdd.value = false;
  newTask.value = { name: "", description: "", date: "", time: "" };
}

function isEditableTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return (
    el.isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "BUTTON"
  );
}

function getTaskHeaders() {
  const board = document.querySelector(".taskboard");
  if (!board) return [];
  return Array.from(board.querySelectorAll(".task-header.clickableHead"));
}

function focusFirstTaskHeader() {
  const headers = getTaskHeaders();
  if (headers.length === 0) return false;
  headers[0]?.focus?.();
  return true;
}

function focusTaskHeader(taskId) {
  nextTick(() => {
    const target = document.querySelector(
      `.task-header.clickableHead[data-task-id="${normId(taskId)}"]`
    );
    target?.focus?.();
  });
}

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

  const time = d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${date}, ${time}`;
}

function formatDeadline(deadline) {
  return deadline ? toPretty(deadline) : "—";
}

function addTask() {
  if (isAddDisabled.value) return;

  let deadline = null;
  const hasDate = String(newTask.value.date || "").trim().length > 0;
  const hasTime = String(newTask.value.time || "").trim().length > 0;

  if (hasDate && hasTime) {
    const [year, month, day] = newTask.value.date.split("-").map(Number);
    const [hours, minutes] = newTask.value.time.split(":").map(Number);
    deadline = new Date(year, month - 1, day, hours, minutes);
  }

  props.model.createTask({
    name: newTask.value.name,
    description: newTask.value.description,
    deadline,
    statusId: statusIds.value.todo,
  });

  closeAdd();
  loadBoard();
}


/* ✅ Drag & Drop */
const draggedTaskId = ref(null);
const dragOverStatusId = ref(null);

function onDragStart(task) {
  draggedTaskId.value = task.id;
  markDragHintSeen();
}
function onDragEnd() {
  draggedTaskId.value = null;
  dragOverStatusId.value = null;
}
function onDragOver(statusId) {
  dragOverStatusId.value = statusId;
}
function onDragLeave() {
  dragOverStatusId.value = null;
}
function onDrop(targetStatusId) {
  if (!draggedTaskId.value) return;
  moveTask(draggedTaskId.value, targetStatusId);
  draggedTaskId.value = null;
  dragOverStatusId.value = null;
}

/* ✅ Keep dropdowns open: update local tasks list instead of loadBoard() */
function updateTaskStatusLocally(taskId, newStatusId) {
  const idx = tasks.value.findIndex((t) => normId(t.id) === normId(taskId));
  if (idx === -1) return;
  tasks.value[idx] = { ...tasks.value[idx], statusId: newStatusId };
}

function moveTask(taskId, newStatusId) {
  props.model.updateTaskStatus(taskId, newStatusId);

  updateTaskStatusLocally(taskId, newStatusId);

  showToast(`Moved to ${statusLabel(newStatusId)}`);

  // Persist open state so even if model triggers rerender, it restores
  saveOpenState();
}

function toDateAndTime(isoLike) {
  const d = new Date(isoLike);
  const pad = (n) => String(n).padStart(2, "0");
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return { date, time };
}

function openEdit(task) {
  showEdit.value = true;

  const dt = task.deadline ?
    toDateAndTime(task.deadline) :
    {date: "", time: ""};

  editForm.value = {
    id: task.id,
    name: task.name ?? "",
    description: task.description ?? "",
    date: dt.date,
    time: dt.time,
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

  let deadline = null;
  const hasDate = String(editForm.value.date || "").trim().length > 0;
  const hasTime = String(editForm.value.time || "").trim().length > 0;

  if (hasDate && hasTime) {
    const [year, month, day] = editForm.value.date.split("-").map(Number);
    const [hours, minutes] = editForm.value.time.split(":").map(Number);
    deadline = new Date(year, month - 1, day, hours, minutes);
  }

  props.model.updateTask({
    id: editForm.value.id,
    name: editForm.value.name,
    description: editForm.value.description,
    deadline: deadline || null,
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
  showToast("Task deleted");
  loadBoard();
}

function handleAssignment(taskId) {
  if (!props.model.isUserPartOfTask(taskId)) {
    props.model.assignTaskToCurrentUser(taskId);
    showToast("Assigned to you");
  } else {
    props.model.unassignTaskFromCurrentUser(taskId);
    showToast("Unassigned from task");
  }
  loadBoard();
}

function handleTaskKey(e, taskId) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleTask(taskId);
    return;
  }

  if (e.key === "Escape") {
    if (isTaskOpen(taskId)) {
      e.preventDefault();
      toggleTask(taskId);
    }
    return;
  }

  if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
  e.preventDefault();

  const current = e.currentTarget;
  const column = current?.closest?.(".column");
  if (!column) return;

  const headers = Array.from(column.querySelectorAll(".task-header.clickableHead"));
  const idx = headers.indexOf(current);
  if (idx === -1) return;

  if (e.shiftKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
    const task = tasks.value.find((t) => normId(t.id) === normId(taskId));
    if (!task) return;

    const order = [statusIds.value.todo, statusIds.value.inProgress, statusIds.value.done];
    const orderKeys = order.map(normId);
    const currentIdx = orderKeys.indexOf(normId(task.statusId));
    if (currentIdx === -1) return;

    const nextIdx = e.key === "ArrowRight" ? currentIdx + 1 : currentIdx - 1;
    if (nextIdx < 0 || nextIdx >= order.length) return;

    moveTask(taskId, order[nextIdx]);
    focusTaskHeader(taskId);
    return;
  }

  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    const nextIdx = e.key === "ArrowDown" ? idx + 1 : idx - 1;
    headers[nextIdx]?.focus?.();
    return;
  }

  const board = column.closest(".taskboard");
  const columns = Array.from((board || column.parentElement).querySelectorAll(".column"));
  const colIdx = columns.indexOf(column);
  if (colIdx === -1) return;

  const targetCol = e.key === "ArrowRight" ? columns[colIdx + 1] : columns[colIdx - 1];
  if (!targetCol) return;

  const targetHeaders = Array.from(targetCol.querySelectorAll(".task-header.clickableHead"));
  if (targetHeaders.length === 0) return;

  const targetIdx = Math.min(idx, targetHeaders.length - 1);
  targetHeaders[targetIdx]?.focus?.();
}

function markDragHintSeen() {
  if (!showDragHint.value) return;
  showDragHint.value = false;
  try {
    sessionStorage.setItem(dragHintKey, "1");
  } catch (e) {}
}

function statusLabel(statusId) {
  const key = normId(statusId);
  if (key === normId(statusIds.value.todo)) return "To Do";
  if (key === normId(statusIds.value.inProgress)) return "In Progress";
  if (key === normId(statusIds.value.done)) return "Done";
  return "Updated";
}

function showToast(message) {
  toast.value = { show: true, message };
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = { show: false, message: "" };
    toastTimer = null;
  }, 1800);
}

try {
  showDragHint.value = !sessionStorage.getItem(dragHintKey);
} catch (e) {
  showDragHint.value = true;
}

onBeforeUnmount(() => {
  if (escEdit) window.removeEventListener("keydown", escEdit);
  if (escDelete) window.removeEventListener("keydown", escDelete);
  if (toastTimer) clearTimeout(toastTimer);
  if (globalKeyHandler) window.removeEventListener("keydown", globalKeyHandler);
});
</script>

<style scoped>
* { box-sizing: border-box; }

.assigned {
  background-color: #2563eb !important;
  color: white !important;
}

.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px;
  box-sizing: content-box;
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

.card-temp {
  background-color: #aebdf7;
}

.layout {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 18px;
  align-items: start;
}

.taskboard {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background-color: #8495d8;
  padding: 20px;
  border-radius: 14px;
}

.column {
  flex: 1;
  background-color: #aebdf7;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px;
  min-height: 520px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}

.column.dropzone {
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25), 0 6px 18px rgba(2, 6, 23, 0.06);
}

.col-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:12px;
  padding-bottom:10px;
  border-bottom: 1px solid #eef2f7;
}

.column h2 {
  margin: 0 0 12px 0;
  font-size: 18px;
}

.drag-hint {
  margin: -4px 0 12px 0;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
}

.empty-state {
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  margin-bottom: 12px;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
  color: #64748b;
  font-size: 12px;
}

.empty-title {
  font-weight: 800;
  color: #334155;
}

.empty-text {
  color: #64748b;
}

.empty-link {
  justify-self: start;
  border: none;
  background: transparent;
  color: #2563eb;
  font-weight: 800;
  font-size: 12px;
  padding: 0;
  cursor: pointer;
}

.empty-link:hover {
  text-decoration: underline;
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

.field {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
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

.hint {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #64748b;
}

/* Compact tasks */
.task.compact {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  background: #ffffff;
  margin-bottom: 12px;
  cursor: grab;
  transition: box-shadow 160ms ease, border-color 160ms ease;
}

.task.compact:hover {
  border-color: #cbd5f5;
  box-shadow: 0 8px 18px rgba(2, 6, 23, 0.08);
}

.task.compact:active {
  cursor: grabbing;
}

/* dropdown visual */
.task.compact.open {
  box-shadow: 0 10px 22px rgba(2, 6, 23, 0.08);
}

.task-body {
  margin-top: 10px;
  border-top: 1px solid #eef2f7;
  padding-top: 10px;
}

.clickableHead {
  cursor: pointer;
  user-select: none;
}

.clickableHead:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 8px;
}

.head-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.caret {
  display: inline-block;
  transform: rotate(0deg);
  transition: transform 140ms ease;
  font-weight: 900;
  color: #334155;
}

.caret.open {
  transform: rotate(90deg);
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.task-title {
  margin: 0;
  font-size: 15px;
  font-weight: 900;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-desc {
  margin: 0 0 8px 0;
  color: #334155;
  font-size: 13px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  display: grid;
  gap: 6px;
  margin-bottom: 8px;
}

.meta-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.meta-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 800;
}

.meta-value {
  font-size: 12px;
  color: #0f172a;
  font-weight: 800;
  text-align: right;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.actions-3 { flex-wrap: wrap; }

.move-row {
  margin-top: 8px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.in-progress { min-width: 265px; }

/* Buttons */
.btn {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  padding: 9px 12px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
  font-size: 13px;
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

.btn-small{
  padding: 8px 12px;
  font-size: 13px;
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

/* Toast */
.toast {
  position: fixed;
  right: 18px;
  bottom: 18px;
  background: #0f172a;
  color: #ffffff;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
  box-shadow: 0 10px 26px rgba(2, 6, 23, 0.3);
  opacity: 0;
  transform: translateY(8px);
  pointer-events: none;
  transition: opacity 160ms ease, transform 160ms ease;
  z-index: 10000;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1000px) {
  .taskboard { flex-direction: column; }
  .field-row { grid-template-columns: 1fr; }
  .in-progress { min-width: 100px; }
}
</style>
