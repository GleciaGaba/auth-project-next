// src/pages/Article.js
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Article() {
  const [comments, setComments] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/posts/all-posts")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched comments:", data);
        setComments(data);
      })
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
          body: JSON.stringify({
            title: newTitle,
            description: newDescription,
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setComments(data);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      //console.error("Error adding comment:", error);
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
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Add your title"
              required
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Add your description"
              required
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-3 mr-5"
            >
              Add Post
            </button>
          </form>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div>
            {Array.isArray(comments) &&
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-200 p-4 rounded mb-2">
                  <h2 className="font-bold">{comment.title}</h2>
                  <p>{comment.description}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
