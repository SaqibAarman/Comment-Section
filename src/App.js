import { useEffect, useState } from "react";
import "./components/Styles/App.scss";
import Comment from "./components/Comment";
import AddComment from "./components/AddComment";

function App() {
  const [comments, setComments] = useState([]);
  const [deleteModalState, setDeleteModalState] = useState(false);

  const getCommentsData = () => {
    fetch("./Data/data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setComments(data.comments);
      });
  };

  useEffect(() => {
    localStorage.getItem("comments") == null
      ? setComments(JSON.parse(localStorage.getItem("comments")))
      : getCommentsData();
  }, []);

  useEffect(() => {
    // SETTING UP NEW COMMENTS IN LOCAL STORAGE
    localStorage.setItem("comments", JSON.stringify(comments));

    // FOR DELETE MODAL

    deleteModalState
      ? document.body.classList.add("overflow--hidden")
      : document.body.classList.remove("overflow--hidden");
  }, [comments, deleteModalState]);

  // update score
  const updateScore = (score, id, type, method) => {
    let updatedComments = [...comments];

    // CHECK FOR ADDING VOTE FOR DIRECT COMMENT
    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.score = score;
          data.voted = method === "upvote" ? true : false;
        }
      });
    } else if (type === "reply") {
      // CHECK FOR ADDING VOTE FOR REPLY THREAD
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.score = score;
            data.voted = method === "upvote" ? true : false;
          }
        });
      });
    }
    setComments(updatedComments);
  };

  // add comments
  const addComments = (newComment) => {
    const newComments = [...comments, newComment];
    setComments(newComments);
  };

  // add replies
  const updateReplies = (replies, id) => {
    let updatedReplyComments = [...comments];
    updatedReplyComments.forEach((data) => {
      if (data.id === id) {
        data.replies = [...replies];
      }
    });
    setComments(updatedReplyComments);
  };

  // EDIT COMMENT
  const editComment = (content, id, type) => {
    let updatedComments = [...comments];

    if (type === "comment") {
      updatedComments.forEach((data) => {
        if (data.id === id) {
          data.content = content;
        }
      });
    } else if (type === "reply") {
      updatedComments.forEach((comment) => {
        comment.replies.forEach((data) => {
          if (data.id === id) {
            data.content = content;
          }
        });
      });
    }

    setComments(updatedComments);
  };

  // delete comment
  let commentDelete = (id, type, parentComment) => {
    let updatedComments = [...comments];
    let updatedReplies = [];

    if (type === "comment") {
      updatedComments = updatedComments.filter((data) => data.id !== id);
    } else if (type === "reply") {
      comments.forEach((comment) => {
        if (comment.id === parentComment) {
          updatedReplies = comment.replies.filter((data) => data.id !== id);
          comment.replies = updatedReplies;
        }
      });
    }

    setComments(updatedComments);
  };

  return (
    <main className="App">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          commentData={comment}
          updateScore={updateScore}
          updateReplies={updateReplies}
          editComment={editComment}
          commentDelete={commentDelete}
          setDeleteModalState={setDeleteModalState}
        />
      ))}
      <AddComment buttonValue={"send"} addComments={addComments} />
    </main>
  );
}

export default App;
