import CommentBtn from "./CommentBtn";
import { format } from "timeago.js";

const CommentHeader = ({
  commentData,
  replying,
  setReplying,
  setDeleting,
  setDeleteModalState,
  setEditing,
}) => {
  
  function displayTime(comment) {
    if (comment.currentUser) {
      return format(comment.createdAt);
    } else {
      return comment.createdAt;
    }
  }

  return (
    <div className="comment--header">
      <div className={`profile-pic ${commentData.user.username}`}></div>
      <div className="username">{commentData.user.username}</div>
      {commentData.currentUser ? <div className="you-tag">you</div> : ""}
      <div className="comment-posted-time">{displayTime(commentData)}</div>
      <CommentBtn
        commentData={commentData}
        replying={replying}
        setReplying={setReplying}
        setDeleting={setDeleting}
        setDeleteModalState={setDeleteModalState}
        setEditing={setEditing}
      />
    </div>
  );
};

export default CommentHeader;
