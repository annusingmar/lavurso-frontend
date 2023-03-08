import { Platform } from "quasar";

const routes = [
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
    props: (route) => ({ redirect: route.query.redirect }),
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      //  path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "messages",
        component: () => import("pages/User/MessageList.vue"),
      },
      {
        path: "messages/new",
        component: () => import("pages/User/MessageNew.vue"),
      },
      {
        path: "messages/:id",
        component: () => import("pages/User/MessagePage.vue"),
        props: true,
      },
      {
        path: "messages/:id/members",
        component: () => import("pages/User/MessageMembers.vue"),
        props: true,
      },
      {
        path: "profile",
        component: () => import("pages/User/ProfilePage.vue"),
      },
      // admin routes
      {
        path: "admin/users",
        component: () => import("pages/Admin/UsersList.vue"),
        meta: { level: "admin" },
      },
      {
        path: "admin/users/new",
        component: () => import("pages/Admin/UserEditGeneral.vue"),
        props: { isCreate: true },
        meta: { level: "admin" },
      },
      {
        path: "admin/users/:id",
        component: () => import("pages/Admin/UserEdit.vue"),
        props: true,
        meta: { level: "admin" },
      },
      {
        path: "admin/grades",
        component: () => import("pages/Admin/GradesPage.vue"),
        meta: { level: "admin" },
      },
      {
        path: "admin/subjects",
        component: () => import("pages/Admin/SubjectsPage.vue"),
        meta: { level: "admin" },
      },
      {
        path: "admin/groups",
        component: () => import("pages/Admin/GroupsPage.vue"),
        meta: { level: "admin" },
      },
      {
        path: "admin/groups/:id",
        component: () => import("pages/Admin/GroupEdit.vue"),
        meta: { level: "admin" },
        props: true,
      },
      {
        path: "admin/classes",
        component: () => import("pages/Admin/ClassesPage.vue"),
        meta: { level: "admin" },
      },
      {
        path: "admin/classes/new",
        component: () => import("pages/Admin/ClassDetails.vue"),
        props: { isCreate: true },
        meta: { level: "admin" },
      },
      {
        path: "admin/classes/:id",
        component: () => import("pages/Admin/ClassDetails.vue"),
        meta: { level: "admin" },
        props: true,
      },
      {
        path: "admin/years",
        component: () => import("pages/Admin/YearsPage.vue"),
        meta: { level: "admin" },
      },
      {
        path: "admin/years/new",
        component: () => import("pages/Admin/NewYearPage.vue"),
        meta: { level: "admin" },
      },
      {
        path: "admin/logs",
        component: () => import("pages/Admin/LogsPage.vue"),
        meta: { level: "admin" },
      },
      // teacher routes
      {
        path: "teacher/journals",
        component: () => import("pages/Teacher/JournalsList.vue"),
        meta: { level: "teacher" },
      },
      {
        path: "teacher/journals/new",
        component: () => import("pages/Teacher/JournalGeneral.vue"),
        props: { isCreate: true },
        meta: { level: "teacher" },
      },
      {
        path: "teacher/journals/:id",
        component: () => import("pages/Teacher/JournalDetail.vue"),
        props: true,
        meta: { level: "teacher" },
      },
      {
        path: "teacher/lessons/:id",
        component: () => import("pages/Teacher/LessonDetail.vue"),
        props: true,
        meta: { level: "teacher" },
      },
      {
        path: "teacher/classes",
        component: () => import("pages/Teacher/ClassesList.vue"),
        meta: { level: "teacher" },
      },
      {
        path: "teacher/students/:id",
        component: () => import("pages/Teacher/StudentDetail.vue"),
        meta: { level: "teacher" },
        props: true,
      },
      // student routes
      {
        path: "students/:id/journals",
        component: () => import("pages/Student/JournalsList.vue"),
        props: true,
      },
      {
        path: "students/:id/grades",
        component: () => import("pages/Student/GradesList.vue"),
        props: true,
      },
      {
        path: "students/:id",
        component: () =>
          Platform.is.mobile
            ? import("pages/Student/HomePageMobile.vue")
            : import("pages/Student/HomePage.vue"),
        props: true,
      },
    ],
  },

  {
    path: "/access-denied",
    component: () => import("pages/ErrorAccessDenied.vue"),
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
