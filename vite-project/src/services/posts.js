import { apiRequest } from "./api";

export function getPosts() {
  return apiRequest("/posts");
}

export function createPost(body) {
  return apiRequest("/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
}

export function updatePost(postId, body) {
  return apiRequest(`/posts/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
  });
}

export function getComments(postId) {
  return apiRequest(`/posts/${postId}/comments`);
}

export function getPost(postId) {
  return apiRequest(`/posts/${postId}`);
}

export function createComment(postId, content) {
  return apiRequest(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
}
export function deletePost(postId) {
  return apiRequest(`/posts/${postId}`, {
    method: "DELETE",
  });
}