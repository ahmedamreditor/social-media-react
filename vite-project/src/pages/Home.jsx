import { useEffect, useState } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "../services/posts";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");
  const [creating, setCreating] = useState(false);
  const [postError, setPostError] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [updatedBody, setUpdatedBody] = useState("");

  async function fetchPosts() {
    try {
      const response = await getPosts();
      setPosts(response.data.posts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleCreatePost(e) {
    e.preventDefault();

    if (!body.trim()) return;

    setCreating(true);
    setPostError("");

    try {
      await createPost(body);
      setBody("");
      await fetchPosts();
    } catch (err) {
      setPostError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdatePost(postId) {
    if (!updatedBody.trim()) return;

    setPostError("");

    try {
      await updatePost(postId, updatedBody);
      setEditingPostId(null);
      await fetchPosts();
    } catch (err) {
      setPostError(err.message);
    }
  }

  async function handleDeletePost(postId) {
    setPostError("");

    try {
      await deletePost(postId);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
    } catch (err) {
      setPostError(err.message);
    }
  }

  if (loading) return <h2>Loading posts...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <h1>Home</h1>

      <form onSubmit={handleCreatePost}>
        <textarea
          placeholder="What's on your mind?"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button className="create-post-btn" type="submit" disabled={creating}>
          {creating ? "Publishing..." : "Create Post"}
        </button>
      </form>

      {postError && <p>{postError}</p>}

      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.user.name}</h3>

          {editingPostId === post._id ? (
            <div>
              <textarea
                value={updatedBody}
                onChange={(e) => setUpdatedBody(e.target.value)}
              />

              <button onClick={() => handleUpdatePost(post._id)}>
                Save
              </button>

              <button onClick={() => setEditingPostId(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p>{post.body}</p>

              <button
                onClick={() => {
                  setEditingPostId(post._id);
                  setUpdatedBody(post.body);
                }}
              >
                Edit
              </button>

              <button onClick={() => handleDeletePost(post._id)}>
                Delete
              </button>
            </>
          )}

          <Link to={`/post/${post._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default Home;