<template>
  <section class="page">
    <div class="page-header">
      <!--h2>Home</h2-->
      <p class="subtitle">Overview of upcoming deadlines and active projects.</p>
    </div>

    <div class="layout">
      <!-- Left: Deadlines -->
      <div class="card card-deadlines">
        <div class="card-header">
          <h2 class="card-title">Upcoming Deadlines</h2>
        </div>

        <!-- ✅ WRAPPER so styling only affects deadlines -->
        <div class="deadlines-list">
          <Deadlines :model="model" current-project-only="false" />
        </div>
      </div>

      <!-- Right: Projects -->
      <div class="card card-project">
        <div class="card-header">
          <h2 class="card-title">Active Projects</h2>
        </div>

        <div class="stack">
          <!-- ✅ WRAPPER for active projects -->
          <div class="active-projects-list">
            <UserProjects :model="model" :redirect="true" />
          </div>

          <div class="button-row">
            <NewProjBtn :model="model" />
            <FindProjects :model="model" />
            <LeaveProjects :model="model"/>
          </div>

          
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Deadlines from "../components/Deadlines.vue";
import FindProjects from "@/components/FindProjects.vue";
import NewProjBtn from "@/components/NewProjBtn.vue";
import UserProjects from "@/components/UserProjects.vue";
import LeaveProjects from "@/components/LeaveProjects.vue";

export default {
  props: ["model", "reRenderKey"],
  components: { Deadlines, NewProjBtn, UserProjects, FindProjects, LeaveProjects},
};
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
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
}

.card-project {
  background-color: #aebdf7;
}

.card-deadlines {
  border: 2px solid #aebdf7;
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

/* Right card spacing */
.stack {
  display: grid;
  gap: 14px;
}

.button-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* Find project section */
.section {
  padding-top: 10px;
  border-top: 1px solid #eef2f7;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

.helper {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #64748b;
}

/* =========================
   DEADLINES styling (ONLY inside .deadlines-list)
========================= */
.deadlines-list :deep(ul) {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.deadlines-list :deep(li) {
  padding: 10px 10px;
  
  border-radius: 12px;
  margin-bottom: 10px;
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
  font-weight: 700;
}

.deadlines-list :deep(a:hover) {
  text-decoration: underline;
}

/* nested project name line */
.deadlines-list :deep(ul ul) {
  margin-top: 6px;
  padding-left: 0;
}

.deadlines-list :deep(ul ul li) {
  margin: 6px 0 0 0;
  border: none;
  padding: 0;
  background: transparent;
  box-shadow: none;
  transform: none;
}

.deadlines-list :deep(ul ul li a),
.deadlines-list :deep(ul ul li) {
  font-weight: 500;
  color: #64748b;
}

/* =========================
   ACTIVE PROJECTS styling (targets <li> because UserProjects uses <li>)
========================= */
.active-projects-list :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Give the list a little breathing room */
.active-projects-list {
  padding: 2px; /* or 0 if you prefer */
}

/* Make items fit inside the card */
.active-projects-list :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

.active-projects-list :deep(li) {
  display: block;
  width: auto;              /* ✅ not 100% */
  margin: 8px 0;           /* ✅ only vertical margin */
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  box-sizing: border-box;   /* ✅ makes borders behave */
  transition: background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}


.active-projects-list :deep(li:hover) {
  background: rgba(37, 99, 235, 0.22);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.10);
}

.active-projects-list :deep(li:focus-visible) {
  outline: 3px solid rgba(37, 99, 235, 0.35);
  outline-offset: 2px;
  background: rgba(37, 99, 235, 0.28);
}
</style>
