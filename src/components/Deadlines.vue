```vue
<template>
  <div class="deadlines">
    <ul>
      <li
        v-for="t in getTasks()"
        :key="t.id"
        :class="['deadline-item', urgencyClass(t.deadline, t.userId)]"
      >
        <router-link
          class="task-link"
          to="/taskboard"
          @click="setCurrentProject(t.projectId)"
        >
          {{ formatDeadline(t.deadline, t.userId) }} — {{ t.name }}
        </router-link>

        <div v-if="currentProjectOnly != true" class="project-line">
          <router-link
            to="/project"
            class="project-link"
            @click="setCurrentProject(t.projectId)"
          >
            {{ t.projectName }}
          </router-link>
        </div>
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

    urgencyClass(deadline, assignee) {
      if (!deadline) return "is-normal";
      const d = deadline instanceof Date ? deadline : new Date(deadline);
      if (Number.isNaN(d.getTime())) return "is-normal";

      const diffHours = (d.getTime() - Date.now()) / (1000 * 60 * 60);

      if (diffHours < 0) return "is-past";
      if (assignee === null) return "is-unassigned";
      if (diffHours <= 24) return "is-urgent";
      if (diffHours <= 72) return "is-soon";
      return "is-normal";
    },

    formatDeadline(deadline, assignee) {
      if (!deadline) return "";
      const d = deadline instanceof Date ? deadline : new Date(deadline);

      if (Number.isNaN(d.getTime())) {
        const s = String(deadline);
        return s.length >= 16 ? s.slice(0, 16) : s;
      }

      const now = Date.now();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const oneWeekAhead = new Date();
      oneWeekAhead.setDate(oneWeekAhead.getDate() + 7);

      let datePart;
      const ds = d.toDateString();
      if (ds === yesterday.toDateString()) {
        datePart = "Yestarday";
      }
      else if (ds === (new Date()).toDateString()) {
        datePart = "Today";
      }
      else if (ds === tomorrow.toDateString()) {
        datePart = "Tomorrow";
      }
      else {
        datePart = d.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          //year: "numeric",
          ...(d.getFullYear() != (new Date).getFullYear()) && {year: "numeric"},
        }); // "Jan 10, 2026"
      }

      const time = d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }); // "22:00"

      let unassignedInfo = assignee === null ? "Unassigned " : "";
      let missedInfo = "";
      let timeLeft = "";
      const diffMs = d.getTime() - now;

      if (diffMs < 0) {
        missedInfo = "Missed! "
        timeLeft = " (past)";
      } else {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours == 0) {
          timeLeft = `(in <1 h)`;
        }
        else if (diffHours < 24) {
          timeLeft = `(in ${diffHours} h)`; //${diffHours === 1 ? "" : "s"})`;
        } else if (d < oneWeekAhead) {
          timeLeft = `(in ${diffDays} day${diffDays === 1 ? "" : "s"})`;
        }
      }
      
      const infoText = `${missedInfo}${unassignedInfo}`;

      return `${infoText}${datePart}, ${time}  ${timeLeft}`;
    },

    setCurrentProject(projectId) {
      this.model.setCurrentProject(projectId);
    },
  },
};
</script>

<style scoped>
.deadlines ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.deadline-item {
  border: 1px solid #e2e8f0;
  border-left: 6px solid #2563eb;
  border-radius: 12px;
  margin: 10px 0;
  overflow: hidden;
  background: rgba(37, 99, 235, 0.05);
}

.task-link {
  display: block;
  padding: 10px 12px;
  color: #0f172a;
  text-decoration: none;
  font-weight: 800;
  transition: background 160ms ease, color 160ms ease;
}

.task-link:hover {
  background: rgba(37, 99, 235, 0.18);
  color: #0b1220;
}

.task-link:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
  background: rgba(37, 99, 235, 0.22);
}

.project-line {
  padding: 0 12px 12px 12px;
}

.project-link {
  display: inline-block;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
}

.project-link:hover {
  text-decoration: underline;
}

/* urgency */
.deadline-item.is-urgent {
  border-left-color: #dc2626;
  background: rgba(220, 38, 38, 0.06);
}

.deadline-item.is-soon {
  border-left-color: #f59e0b;
  background: rgba(245, 158, 11, 0.08);
}

.deadline-item.is-normal {
  border-left-color: #2563eb;
  background: rgba(37, 99, 235, 0.05);
}

.deadline-item.is-past {
  border-left-color: #94a3b8;
  background: rgba(148, 163, 184, 0.1);
  opacity: 0.9;
}

.deadline-item.is-past .task-link {
  color: #64748b;
}

.deadline-item.is-unassigned {
  border-left-color: #6d0a88;
  background: rgba(191, 17, 207, 0.05);
}
</style>
```
