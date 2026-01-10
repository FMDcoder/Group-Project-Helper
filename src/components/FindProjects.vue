<template>
  <div>
    <!-- Button to open popup -->
    <button class="openBtn" @click="openPopup">Join project</button>

    <!-- Overlay -->
    <div v-if="isOpen" class="overlay" @click="closePopup">
      <!-- Popup box -->
      <div class="popup" @click.stop>
        <div class="header">
          <h4>Find project</h4>
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

          <!-- When user types -->
          <p v-if="searchQuery.trim()" class="meta">
            {{ filteredProjects.length }} result{{ filteredProjects.length === 1 ? "" : "s" }}
          </p>

          <!-- Results -->
          <ul v-if="searchQuery.trim() && filteredProjects.length" class="results">
            <li v-for="p in filteredProjects" :key="p.id" class="resultRow">
              <router-link
                to="/project"
                class="resultLink"
                @click="selectProject(p.id)"
              >
                <span class="resultName">
                  <template
                    v-for="(part, i) in highlightParts(p.name, searchQuery)"
                    :key="i"
                  >
                    <mark v-if="part.match" class="hl">{{ part.text }}</mark>
                    <span v-else>{{ part.text }}</span>
                  </template>
                </span>

                <span class="badge">{{ p.progress }}%</span>
              </router-link>
            </li>
          </ul>

          <!-- No results -->
          <p v-else-if="searchQuery.trim()" class="hint">
            No projects found.
          </p>

          <!-- Nothing typed yet -->
          <p v-else class="hint">
            Please type something to search for a project.
          </p>

          <div class="footer">
            <button class="closeBtn" @click="closePopup">Close</button>
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
    };
  },

  computed: {
    // Always return an array so Vue never crashes
    projects() {
      return this.model?.getProjects?.() ?? [];
    },

    filteredProjects() {
      const query = this.searchQuery.trim().toLowerCase();
      if (!query) return [];

      return this.projects.filter((project) =>
        String(project?.name ?? "").toLowerCase().includes(query)
      );
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
    },

    setCurrentProject(id) {
      this.model?.setCurrentProject?.(id);
    },

    selectProject(id) {
      this.setCurrentProject(id);
      this.closePopup();
    },

    // Highlight matched query safely (no v-html)
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
  width: min(620px, 100%);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.22);
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

/* Inner wrapper */
.projects {
  max-width: 100%;
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

/* Meta line */
.meta {
  margin: 10px 0 8px;
  font-size: 12px;
  color: #6b7280;
}

/* Results */
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

.resultLink {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 12px;
  text-decoration: none;
  color: inherit;
  background: white;
  transition: background 120ms ease;
}

.resultLink:hover {
  background: #f8fafc;
}

.resultName {
  font-weight: 600;
  font-size: 14px;
}

/* Match highlight */
.hl {
  background: #fff3bf;
  padding: 0 3px;
  border-radius: 6px;
}

/* Progress badge */
.badge {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  color: #334155;
  background: #f8fafc;
  white-space: nowrap;
}

/* Hints */
.hint {
  color: #6b7280;
  font-style: normal;
  margin-top: 10px;
}

/* Footer */
.footer {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

.closeBtn {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
}
</style>
