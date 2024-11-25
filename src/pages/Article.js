import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

// Fonction pour décoder la partie payload du token JWT
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to parse JWT:", e);
    return null;
  }
}

export default function Article() {
  const [comments, setComments] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null); // État pour suivre le commentaire en mode édition

  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      if (token) {
        const decodedToken = parseJwt(token);
        if (!decodedToken) {
          console.error("Failed to decode token");
          return;
        }
        const userId = decodedToken.userId; // Assurez-vous que le token contient un champ userId
        console.log("User ID:", userId);

        try {
          const response = await fetch(
            `http://localhost:3001/api/posts/all-posts`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`, // Le backend utilise ce token pour extraire userId
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Error response text:", errorText);
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("Fetched data:", data); // Ajoutez ce journal pour vérifier les données reçues
          if (Array.isArray(data.data)) {
            const userComments = data.data.filter(
              (comment) => comment.userId._id === userId
            );
            setComments(userComments);
          } else {
            console.error("Fetched data is not an array:", data);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      } else {
        console.error("No token found");
      }
    };

    fetchComments();
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setComments((prevComments) => [...prevComments, data]);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Error adding comment. Please try again.");
    }
  };

  const handleUpdate = async (commentId, updatedTitle, updatedDescription) => {
    if (editCommentId === commentId) {
      // Si le commentaire est déjà en mode édition, soumettre les modifications
      try {
        console.log(
          "Updating comment:",
          commentId,
          updatedTitle,
          updatedDescription
        ); // Ajoutez ce journal pour vérifier les données envoyées
        const response = await fetch(
          `http://localhost:3001/api/posts/update-post?_id=${commentId}`, // Utilisez les paramètres de requête pour passer l'ID du commentaire
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              title: updatedTitle,
              description: updatedDescription,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response text:", errorText);
          throw new Error("Network response was not ok");
        }

        const updatedComment = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId ? updatedComment : comment
          )
        );
        setEditCommentId(null); // Quitter le mode édition
      } catch (error) {
        console.error("Error updating comment:", error);
      }
    } else {
      // Passer en mode édition
      setEditCommentId(commentId);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      console.log("Deleting comment:", commentId); // Ajoutez ce journal pour vérifier les données envoyées
      const response = await fetch(
        `http://localhost:3001/api/posts/delete-post?_id=${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response text:", errorText);
        throw new Error("Network response was not ok");
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleInputChange = (e, commentId, field) => {
    const { value } = e.target;
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId ? { ...comment, [field]: value } : comment
      )
    );
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Add your description"
              required
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded"
            >
              Add Comment
            </button>
          </form>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            {Array.isArray(comments) &&
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm max-w-full"
                >
                  {editCommentId === comment._id ? (
                    <>
                      <input
                        value={comment.title}
                        onChange={(e) =>
                          handleInputChange(e, comment._id, "title")
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 mb-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <textarea
                        value={comment.description}
                        onChange={(e) =>
                          handleInputChange(e, comment._id, "description")
                        }
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold">{comment.title}</h2>
                      <p className="text-gray-700">{comment.description}</p>
                    </>
                  )}
                  <p>
                    Created at: {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() =>
                      handleUpdate(
                        comment._id,
                        comment.title,
                        comment.description
                      )
                    }
                    className="mr-2 p-2 bg-yellow-500 text-white rounded"
                  >
                    {editCommentId === comment._id ? "Submit" : "Update"}
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="p-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
