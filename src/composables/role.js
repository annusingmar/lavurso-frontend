export default function getRoleName(role) {
  switch (role) {
    case "admin":
      return "Administrator";
    case "teacher":
      return "Teacher";
    case "parent":
      return "Parent";
    case "student":
      return "Student";
  }
}
