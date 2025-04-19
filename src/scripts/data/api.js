import CONFIG from "../config";
import { getAccessToken } from "../utils/auth";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  STORY_LIST: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
};

export async function register({ name, email, password }) {
  const payload = JSON.stringify({ name, email, password });
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
  });
  const json = await response.json();

  return {
    ...json,
    ok: response.ok,
  };
}

export async function login({ email, password }) {
  const payload = JSON.stringify({ email, password });
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json " },
    body: payload,
  });
  const json = await response.json();

  return {
    ...json,
    ok: response.ok,
  };
}

export async function postNewStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.set("description", description);
  formData.append("photo", photo);
  formData.set("lat", lat);
  formData.set("lon", lon);

  const response = await fetch(ENDPOINTS.ADD_STORY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: formData,
  });
  const json = await response.json();

  return {
    ...json,
    ok: response.ok,
  };
}

export async function getAllStory() {
  const response = await fetch(ENDPOINTS.STORY_LIST, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await response.json();

  return {
    ...json,
    ok: response.ok,
  };
}

export async function getStoryDetail(id) {
  const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const json = await response.json();

  return {
    ...json,
    ok: response.ok,
  };
}

