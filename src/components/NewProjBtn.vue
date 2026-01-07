<template>
  <div>
    <button class="nav-link nav-debug" @click="openModal">
      + New project
    </button>

    <div v-if="show" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h3>New project</h3>

        <label class="field">
          Project name
          <input v-model.trim="form.name" type="text" placeholder="e.g. Web app" />
        </label>

        <label class="field">
          Deadline
          <input v-model="form.deadline" type="date" />
        </label>

        <div class="actions">
          <button class="btn primary" @click="confirm">OK</button>
          <button class="btn" @click="closeModal">Cancel</button>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewProjBtn",
  emits: ["project-created"],
  data() {
    return {
      show: false,
      error: "",
      form: {
        name: "",
        deadline: ""
      }
    };
  },
  methods: {
    openModal() {
      this.show = true;
      this.error = "";
    },
    closeModal() {
      this.show = false;
      this.error = "";
      this.form = { name: "", deadline: "" };
    },
    confirm() {
      if (!this.form.name || !this.form.deadline) {
        this.error = "Fill in both name and deadline.";
        return;
      }

      const project = {
        id: Date.now(),             // replace with DB id if you use backend
        name: this.form.name,
        deadline: this.form.deadline
      };

      this.$emit("project-created", project);
      this.closeModal();
    }
  }
};
</script>

<style scoped>
/* re-use your pill button look */
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
.nav-link:hover { background-color: #1d4ed8; transform: translateY(-1px); }

/* modal */
.modal-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.modal{
  width: 340px;
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 12px 35px rgba(0,0,0,0.25);
}
.field{
  display: block;
  margin: 0.75rem 0;
  font-weight: 600;
}
.field input{
  display: block;
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.5rem 0.6rem;
}
.actions{
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
.btn{
  padding: 0.45rem 0.8rem;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  cursor: pointer;
}
.btn.primary{
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}
.error{ color: #b91c1c; margin-top: 0.75rem; }
</style>
