<template>
  <div>
    <button class="open-btn" @click="openProject">Edit Project</button>
  </div>

  <!-- Overlay -->
  <div v-if="viewEditProject" class="popup" @click.self="closeProject">
    <div class="container" role="dialog" aria-modal="true" aria-label="Edit project">
      <form @submit.prevent="submit">
        <div class="header">
          <h2 class="title">Edit Project</h2>
          <button type="button" class="btn btn-ghost" @click="closeProject" aria-label="Close">
            ✕
          </button>
        </div>

        <label class="field">
          <span class="field-label">Name</span>
          <input
            ref="nameInput"
            type="text"
            v-model="projectName"
            placeholder="e.g., HCI project"
          />
        </label>

        <label class="field">
          <span class="field-label">Description</span>
          <textarea
            v-model="projectDescription"
            placeholder="Short description of the project..."
          ></textarea>
        </label>

        <p v-if="isSaveDisabled" class="hint">
          Fill in both name and description to enable Save.
        </p>

        <div class="actions">
          <button type="button" class="btn" @click="closeProject">Cancel</button>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSaveDisabled"
            :aria-disabled="isSaveDisabled"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["model"],
  data() {
    return {
      viewEditProject: false,
      projectName: "",
      projectDescription: "",
      escHandler: null,
    };
  },

  computed: {
    isSaveDisabled() {
      return (
        this.projectName.trim().length === 0 ||
        this.projectDescription.trim().length === 0
      );
    },
  },

  methods: {
    openProject() {
      this.viewEditProject = true;

      // Autofocus on Name
      this.$nextTick(() => {
        this.$refs.nameInput?.focus?.();
      });

      // Close on ESC
      this.escHandler = (e) => {
        if (e.key === "Escape") this.closeProject();
      };
      window.addEventListener("keydown", this.escHandler);
    },

    closeProject() {
      this.viewEditProject = false;

      // Remove ESC listener
      if (this.escHandler) {
        window.removeEventListener("keydown", this.escHandler);
        this.escHandler = null;
      }
    },

    submit() {
      if (this.isSaveDisabled) return;

      // TODO later: save to model/database
      // Example: this.model.updateProject({ name: this.projectName, description: this.projectDescription })

      this.closeProject();
    },
  },

  beforeUnmount() {
    if (this.escHandler) window.removeEventListener("keydown", this.escHandler);
  },
};
</script>

<style scoped>
/* Overlay */
.popup {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 9999;
}

/* Modal */
.container {
  width: 520px;
  max-width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.25);
  overflow: hidden;
  padding: 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.title {
  margin: 0;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.field {
  display: grid;
  gap: 6px;
  margin-top: 12px;
}

.field-label {
  font-size: 13px;
  font-weight: 800;
  color: #334155;
}

input[type="text"],
textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

textarea {
  min-height: 120px;
  resize: vertical;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: rgba(37, 99, 235, 0.6);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

/* Buttons */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
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
}

.btn-ghost:hover {
  background: rgba(37, 99, 235, 0.14);
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

/* Hint */
.hint {
  margin: 10px 0 0;
  font-size: 13px;
  color: #64748b;
}

/* Optional: opening button (if you want it styled too) */
.open-btn {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 800;
}
.open-btn:hover {
  background: #f1f5f9;
}
</style>
