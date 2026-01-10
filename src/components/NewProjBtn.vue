<template>
  <div>
    <button class="nav-link nav-debug" type="button" @click="openModal">
      + New project
    </button>

    <div v-if="show" class="modal-backdrop" @click.self="closeModal">
      <div class="modal" role="dialog" aria-modal="true" aria-label="New project">
        <div class="modal-header">
          <h3 class="modal-title">New project</h3>
          <button class="btn btn-ghost" type="button" @click="closeModal" aria-label="Close">
            ✕
          </button>
        </div>

        <div class="modal-body">
          <label class="field">
            <span class="field-label">Project name</span>
            <input
              ref="projectNameInput"
              v-model.trim="form.name"
              type="text"
              placeholder="Project name..."
            />
          </label>

          <label class="field">
            <span class="field-label">Description</span>
            <textarea
              v-model.trim="form.desc"
              rows="4"
              placeholder="Short description of the project..."
            ></textarea>
          </label>

          <p v-if="error" class="error">{{ error }}</p>
          <p v-else-if="isOkDisabled" class="hint">
            Fill in both project name and description to enable OK.
          </p>
        </div>

        <div class="modal-actions">
          <button class="btn" type="button" @click="closeModal">Cancel</button>
          <button
            class="btn btn-primary"
            type="button"
            @click="confirm"
            :disabled="isOkDisabled"
            :aria-disabled="isOkDisabled"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewProjBtn",
  emits: ["modal-change", "project-created", "close-esc"],
  props: ["model"],
  data() {
    return {
      show: false,
      error: "",
      escHandler: null,
      form: {
        name: "",
        desc: ""
      }
    };
  },
  computed: {
    isOkDisabled() {
      return !this.form.name?.trim() || !this.form.desc?.trim();
    }
  },
  methods: {
    openModal() {
      this.show = true;
      this.error = "";

      this.$nextTick(() => {
        this.$refs.projectNameInput?.focus?.();
      });

      this.escHandler = (e) => {
        if (e.key === "Escape") {
          this.closeModal();
          this.$emit("close-esc");
        }
      };
      window.addEventListener("keydown", this.escHandler);
      this.$emit("modal-change", this.show);
    },

    closeModal() {
      this.show = false;
      this.error = "";
      this.form = { name: "", desc: "" };

      if (this.escHandler) {
        window.removeEventListener("keydown", this.escHandler);
        this.escHandler = null;
      }
      this.$emit("modal-change", this.show);
    },

    confirm() {
      if (this.isOkDisabled) {
        this.error = "Fill in both project name and description.";
        return;
      }

      const projectDetails = {
        name: this.form.name.trim(),
        desc: this.form.desc.trim()
      };

      const result = this.model.createProject(projectDetails);
      if (result == 1) {
        this.error = "Project name already exists, please choose another name!";
        return;
      }

      this.$emit("project-created", projectDetails);
      this.closeModal();
    }
  },
  beforeUnmount() {
    if (this.escHandler) window.removeEventListener("keydown", this.escHandler);
  }
};
</script>

<style scoped>
/* Trigger button (pill style) */
.nav-link {
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
.nav-link:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

/* Modal backdrop */
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

/* Modal container */
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
textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
  box-sizing: border-box;
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

/* Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 16px 16px;
}

/* Buttons */
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
  color: #0f172a;
}
.btn-ghost:hover {
  background: rgba(37, 99, 235, 0.14);
  border-color: transparent;
  box-shadow: none;
  transform: none;
}

.error {
  color: #b91c1c;
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.hint {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}
</style>
