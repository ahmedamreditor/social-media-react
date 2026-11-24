import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPost, getComments, createComment } from "../services/posts";

function PostDetails() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentBody, setCommentBody] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPost(id);
        setPost(response.data.post);

        const commentsResponse = await getComments(id);
        setComments(commentsResponse.data.comments);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  async function handleAddComment(e) {
    e.preventDefault();

    try {
      await createComment(id, commentBody);

      setCommentBody("");

      const response = await getComments(id);
      setComments(response.data.comments);
    } catch (err) {
      console.log(err.message);
    }
  }

  if (loading) return <h2>Loading...</h2>;

  if (!post) return <h2>Post not found</h2>;

  return (
    <div>
      <h1>Post Details</h1>

      <h3>{post.user?.name || "Unknown User"}</h3>
      <p>{post.body}</p>

      <hr />

      <h2>Comments</h2>

      <form onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
        />

        <button type="submit">Add Comment</button>
      </form>

     {comments.map((comment) => (
  <div key={comment._id}>
    <h4>{comment.user?.name || "Unknown User"}</h4>
    <p>{comment.content || comment.body || ""}</p>
  </div>
))}
    </div>
  );
}

export default PostDetails;