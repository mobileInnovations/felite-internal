function getLocal(key) {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
    return data; // Return as raw string if parsing fails
  }
}

function getLang() {
  try {
    return localStorage.getItem("LANG");
  } catch (error) {
    console.error("Error parsing localStorage data:", error);
  }
}

function getRole() {
  try {
    const user = localStorage.getItem("USER");
    const parsedUser = user ? JSON.parse(user) : null;

    const roles = Array.isArray(parsedUser?.roles)
      ? parsedUser.roles
      : ["Guest"];

    return roles;
  } catch (error) {
    console.error("Error parsing localStorage USER:", error);
    return ["Guest"];
  }
}


export { getLocal, getLang, getRole };
