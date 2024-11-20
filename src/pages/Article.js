import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Article() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Remplacez l'URL par celle de votre API pour récupérer les commentaires
    fetch("http://localhost:3001/api/posts")
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/api/posts/create-post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ text: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setComments([...comments, data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Error adding comment. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
          <h1 className="text-2xl mb-4">Article Comments</h1>
          <form onSubmit={handleSubmit} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Add your comment"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Add Comment
            </button>
          </form>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-200 p-4 rounded mb-2">
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
