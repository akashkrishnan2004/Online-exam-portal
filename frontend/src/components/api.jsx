const API_URL = "http://localhost:5000/api";

// const API_URL = "https://online-exam-portal-lxzv.onrender.com";

export default API_URL;

// console.log("API URL:", API_URL);

export async function register(username, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  return response.json();
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

export async function requestPasswordReset(email) {
  const response = await fetch(`${API_URL}/request-password-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  return response.json();
}

export async function changePassword(resetToken, newPassword) {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resetToken, newPassword }),
  });
  return response.json();
}
