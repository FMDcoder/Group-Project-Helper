<template>
  <div>
    <!-- Button to open popup -->
    <button class="openBtn" @click="openPopup">Leave Project</button>
    
     <!-- Overlay -->
    <div v-if="isOpenConfirmation" class="overlay" style="z-index: 100"; @click="closeConfirm">
      <!-- Popup box -->
      <div class="popup" @click.stop>
        <div class="header">
          <h4>Confirmation</h4>
          <button class="x" @click="closeConfirm" aria-label="Close">✕</button>
        </div>
        <div>
          <label>Are you sure you want to leave this group?</label>
        </div>
        <div class="dialog-actions">
          <button class="dialog-btn" @click="closeConfirm" aria-label="Close">No</button>
          <button class="dialog-btn dialog-danger" @click="confirm" aria-label="Close">Yes</button>
        </div>
      </div>
    </div>

    <!-- Overlay -->
    <div v-if="isOpen" class="overlay" @click="closePopup">
      <!-- Popup box -->
      <div class="popup" @click.stop>
        <div class="header">
          <h4>Leave project</h4>
          <button class="x" @click="closePopup" aria-label="Close">✕</button>
        </div>

        <div class="projects">
          <input
            ref="searchInput"
            type="text"
            v-model="searchQuery"
            placeholder="Search projects..."
            @keydown.esc="closePopup"
          />

          <p v-if="searchQuery.trim()" class="meta">
            {{ filteredProjects.length }} result{{ filteredProjects.length === 1 ? "" : "s" }}
          </p>

          <!-- Results -->
          <ul v-if="filteredProjects.length" class="results">
            <li v-for="p in filteredProjects" :key="p.id" class="resultRow">
              <div
                class="resultItem"
                :class="{ selected: selectedProjectId === p.id }"
                role="button"
                tabindex="0"
                @click="selectRow(p)"
                @keydown.enter.prevent="selectRow(p)"
              >
                <div class="left">
                  <span class="resultName">
                    <template v-for="(part, i) in highlightParts(p.name, searchQuery)" :key="i">
                      <mark v-if="part.match" class="hl">{{ part.text }}</mark>
                      <span v-else>{{ part.text }}</span>
                    </template>
                  </span>

                  <span class="sub">Progress: {{ p.progress }}%</span>
                </div>

                <div class="right">
                  <span class="badge">{{ p.progress }}%</span>

                  <!-- Join button only shows on selected row -->
                  <button
                    v-if="selectedProjectId === p.id"
                    class="joinBtn"
                    @click.stop="leaveSelected"
                  >
                    Leave
                  </button>
                </div>
              </div>
            </li>
          </ul>

          <!-- No results -->
          <p v-else-if="searchQuery.trim()" class="hint">
            No projects found.
          </p>

          <!-- Optional footer actions -->
          <div class="footer dialog-actions">
            <button class="dialog-btn" @click="closePopup">Close</button>

            <button
              class="dialog-btn dialog-primary"
              :disabled="!selectedProject"
              @click="leaveSelected"
              title="Select a project first"
            >
              Leave selected
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectSearchPopup",
  props: ["model"],

  data() {
    return {
      isOpen: false,
      searchQuery: "",
      selectedProjectId: null,
      isOpenConfirmation: false
    };
  },

  computed: {
    projects() {
      return this.model?.getProjects?.() ?? [];
    },

    filteredProjects() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query || query.length == 0) {
        return this.projects.filter((project) => 
           this.model.isInProject(project?.id)
          );
      }

      return this.projects.filter((project) =>
        String(project?.name ?? "").toLowerCase().includes(query) && this.model.isInProject(project?.id)
      );
    },

    selectedProject() {
      return this.projects.find((p) => p.id === this.selectedProjectId) ?? null;
    },
  },

  watch: {
    // If user changes search, keep selection only if it still exists in results
    searchQuery() {
      if (!this.selectedProjectId) return;
      const stillVisible = this.filteredProjects.some((p) => p.id === this.selectedProjectId);
      if (!stillVisible) this.selectedProjectId = null;
    },
  },

  methods: {
    openPopup() {
      this.isOpen = true;
      this.$nextTick(() => this.$refs.searchInput?.focus());
    },

    closePopup() {
      this.isOpen = false;
      this.searchQuery = "";
      this.selectedProjectId = null;
    },

    setCurrentProject(id) {
      this.model?.setCurrentProject?.(id);
    },

    selectRow(project) {
      this.selectedProjectId = project.id;
    },

    openConfirm() {
      this.isOpenConfirmation = true
    },

    closeConfirm() {
      this.isOpenConfirmation = false
    },

    confirm() {
      this.setCurrentProject(null);
      this.model.leaveUserProject(this.selectedProjectId)

      // If you want to navigate to the project page:
      //if (this.$router) {
      //  this.$router.push("/project");
      //}

      this.closePopup();
      this.closeConfirm();
    },

    leaveSelected() {
      if (!this.selectedProjectId) return;
      this.openConfirm()
    },

    highlightParts(text, query) {
      const t = String(text ?? "");
      const q = String(query ?? "").trim();
      if (!q) return [{ text: t, match: false }];

      const lowerT = t.toLowerCase();
      const lowerQ = q.toLowerCase();

      const idx = lowerT.indexOf(lowerQ);
      if (idx === -1) return [{ text: t, match: false }];

      return [
        { text: t.slice(0, idx), match: false },
        { text: t.slice(idx, idx + q.length), match: true },
        { text: t.slice(idx + q.length), match: false },
      ].filter((p) => p.text.length);
    },
  },
};
</script>

<style scoped>
/* Open button */
.openBtn {
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background-color 120ms ease, transform 120ms ease;
}

/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

/* Popup */
.popup {
  background: white;
  width: min(680px, 100%);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
}

.dialog-actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.dialog-btn {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  font-weight: 800;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}

.dialog-btn:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
}

.dialog-primary {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.dialog-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.dialog-danger {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
}

.dialog-danger:hover {
  background: #b91c1c;
  border-color: #b91c1c;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.header h4 {
  margin: 0;
  font-size: 18px;
}
.x {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

/* Input */
input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  outline: none;
  font-size: 14px;
}
input:focus {
  border-color: #94a3b8;
  box-shadow: 0 0 0 4px rgba(148, 163, 184, 0.35);
}

.meta {
  margin: 10px 0 8px;
  font-size: 12px;
  color: #6b7280;
}

.results {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  overflow: hidden;
}

.resultRow + .resultRow {
  border-top: 1px solid #eef2f7;
}

/* Clickable row */
.resultItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 12px;
  background: white;
  cursor: pointer;
  transition: background 120ms ease, box-shadow 120ms ease;
}
.resultItem:hover {
  background: #f8fafc;
}

/* Selected highlight */
.resultItem.selected {
  background: #eef6ff;
  box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resultName {
  font-weight: 700;
  font-size: 14px;
}

.sub {
  font-size: 12px;
  color: #6b7280;
}

/* Highlight match */
.hl {
  background: #fff3bf;
  padding: 0 3px;
  border-radius: 6px;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  color: #334155;
  background: #f8fafc;
  white-space: nowrap;
}

/* Join button on selected row */
button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.joinBtn {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #dbeafe;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
.joinBtn:hover {
  filter: brightness(0.95);
}

/* Hints */
.hint {
  color: #6b7280;
  margin-top: 10px;
}

/* Footer */
.footer {
  margin-top: 14px;
}

.dialog-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

