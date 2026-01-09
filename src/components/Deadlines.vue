<template>
  <div class="deadlines">
    <ul>
      <li v-for="t in getTasks()" :key="t.id">
        <div>
          <router-link to="/taskboard" @click="setCurrentProject(t.projectId)">
            {{ formatDeadline(t.deadline) }} — {{ t.name }}
          </router-link>
        </div>

        <ul v-if="currentProjectOnly != true">
          <li>
            <router-link
              to="/project"
              class="project-link"
              @click="setCurrentProject(t.projectId)"
            >
              {{ t.projectName }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["model", "currentProjectOnly"],
  methods: {
    getTasks() {
      if (this.currentProjectOnly === true) {
        return this.model.getProjectTasksByDeadline();
      }
      return this.model.getTasksByDeadline();
    },

    // Converts: "2026-01-10 22:00:00" -> "2026 Jan 10, 22:00"
    formatDeadline(deadline) {
      if (!deadline) return "";

      // Handle "YYYY-MM-DD HH:MM:SS" or "YYYY-MM-DD HH:MM"
      // Convert to ISO: "YYYY-MM-DDTHH:MM:SS"

      // If date parsing fails, fall back to trimming seconds
      if (isNaN(deadline.getTime())) {
        return deadline.length >= 16 ? deadline.slice(0, 16) : deadline;
      }

      const checkFutureYear = new Date();
      const checkFutureWeek = new Date();
      const checkFutureDay  = new Date();
      const now = new Date().getTime();
      checkFutureYear.setFullYear(checkFutureYear.getFullYear() + 1);
      checkFutureWeek.setDate(checkFutureWeek.getDate() + 7);
      checkFutureDay.setDate(checkFutureDay.getDate() + 1);
      
      console.log(checkFutureDay - deadline);

      const year = deadline < checkFutureYear ? "" : deadline.getFullYear();

      const monthDay = deadline.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      }); // e.g. "Jan 10"

      const time = deadline.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }); // e.g. "22:00"
      
      let timeLeft = "";
      let diff = 0;
      if (deadline < checkFutureDay) {
        diff = Math.floor(
          (deadline.getTime() - now) % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
        timeLeft = ` (in ${diff} hours)`
      }
      else if (deadline < checkFutureWeek) {
        diff = Math.floor((deadline.getTime() - now) / (1000 * 60 * 60 * 24));
        timeLeft = ` (in ${diff} day${diff == 1 ? "" : "s"})`
      }

      return `${year} ${monthDay}, ${time}${timeLeft}`;
    },

    setCurrentProject(projectId) {
      this.model.setCurrentProject(projectId);
    },
  },
};
</script>

<style scoped>
/* Make deadline links darker and clearer on hover/focus */
.deadlines a {
  display: block;
  padding: 10px 12px;
  border-radius: 12px;
  color: #0f172a;
  text-decoration: none;
  transition: background 160ms ease, color 160ms ease;
}

.deadlines a:hover {
  background: rgba(37, 99, 235, 0.18); /* darker than before */
  color: #0b1220;
}

.deadlines a:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
  background: rgba(37, 99, 235, 0.22); /* a bit stronger */
}

</style>
