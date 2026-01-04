import { createRouter, createWebHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import ProjectView from "../views/ProjectView.vue";
import TaskboardView from "../views/Taskboard.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: StartView },
    { path: "/project", component: ProjectView },
    { path: "/taskboard", component: TaskboardView }
  ]
});