import { useAuthStore } from "@/stores/auth";
import router from "@/router";
import Swal from "sweetalert2";

export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  patch: request("PATCH"),
  put: request("PUT"),
  delete: request("DELETE"),
};

function request(method) {
  return async (url, body, contentType) => {
    const requestOptions = {
      method,
      headers: authHeader(url),
    };

    if (body) {
      if (body instanceof FormData) {
        requestOptions.body = body;
      } else {
        requestOptions.body = JSON.stringify(body);
        requestOptions.headers["Content-Type"] =
          contentType || "application/json";
      }
    } else if (contentType) {
      requestOptions.headers["Content-Type"] = contentType;
    }

    return await fetchWithRetry(url, requestOptions);
  };
}

/* --------------------------- Retry logic --------------------------- */
async function fetchWithRetry(url, options, attempt = 1) {
  const maxAttempts = 5;

  const response = await fetch(url, options);

  // Handle rate limit (429)
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("Retry-After"));
    const delay =
      retryAfter && retryAfter > 0
        ? retryAfter * 1000
        : Math.min(1000 * Math.pow(2, attempt - 1), 10000);
    console.warn(
      `⚠️ 429 Too Many Requests – retrying in ${
        delay / 1000
      }s (attempt ${attempt})`,
    );
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, attempt + 1);
    } else {
      throw new Error("Too many requests – max retries reached");
    }
  }

  return handleResponse(response);
}

/* ------------------------ Auth Header Helper ----------------------- */
function authHeader(url) {
  const { access_token } = useAuthStore();
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);

  if (isApiUrl && access_token) {
    return { Authorization: `Bearer ${access_token}` };
  }
  if (isApiUrl && !access_token) {
    console.warn("🚫 Trying to call API without token:", url);
  }
  return {};
}

/* -------------------------- Response Handler ----------------------- */
async function handleResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    const text = await response.text();
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const { user, logout } = useAuthStore();

      if ([401, 403].includes(response.status) && user) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "Invalid or expired token. Please login again.",
          footer:
            "Please contact IT Admin (Wittaya Tilakanon, Mathulada Katintong)",
          confirmButtonText: "Logout",
          confirmButtonColor: "red",
        }).then((result) => {
          if (result.isConfirmed) logout();
        });
        router.push("/");
      }

      const error = (data && data.message) || response.statusText;
      throw new Error(error);
    }

    return data;
  } else {
    const blobData = await response.blob();
    if (!response.ok) throw new Error("Unexpected non-JSON error response");
    return blobData;
  }
}
