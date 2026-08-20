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
    if (!localStorage.getItem("ROLES")) {
      console.warn("ROLES not found in localStorage, returning default role 'Guest'");
      return ["Guest"];
    }
    return localStorage.getItem("ROLES");
  } catch (error) {
    console.error("Error parsing localStorage ROLES:", error);
    return ["Guest"];
  }
}

export { getLocal, getLang, getRole };
