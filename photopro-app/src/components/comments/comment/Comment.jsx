import React, { useState, useEffect } from "react";
import "./Comment.css";
import ReplyIcon from "@material-ui/icons/Reply";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import axios from "axios";
import replyComment from "./replyComment/replyComment";

export default function Comment(props) {
  const [reply_input, set_reply_input] = useState("");
  const [show_reply_form, set_show_reply_form] = useState(false);
  const [has_replies, set_has_replies] = useState(false);

  let commenterID = String(props.comment_info.commenter);
  let userID = localStorage.getItem("userID");

  if (props.comment_info.reply_id) {
    set_has_replies(true);
  }

  const deleteComment = (commentID) => {
    axios({
      method: "POST",
      url: "http://localhost:5000//post_delete_comment",
      params: { comment_id: commentID },
    }).then((response) => {
      if (response.data.result) {
        console.log(response);
      }
    });
  };

  const handleDeleteClicked = () => {
    deleteComment(props.comment_info.comment_id);
    props.updateComments(props.comment_info.comment.concat("updated"));
  };

  let deleteButton =
    commenterID === userID ? (
      <IconButton onClick={handleDeleteClicked}>
        <DeleteOutlineIcon />
      </IconButton>
    ) : (
      <Button></Button>
    );

  const handleReplyClicked = () => {
    // open the form
    if (show_reply_form) {
      set_show_reply_form(false);
    } else {
      set_show_reply_form(true);
    }
  };

  const handleReplySubmitted = (e) => {
    e.preventDefault();
    post_reply_comments(reply_input);
  };

  const post_reply_comments = (reply_input) => {
    axios({
      method: "POST",
      url: "http://localhost:5000//post_comment_to_comment",
      params: {
        comment_id: props.comment_info.comment_id,
        comment: reply_input,
        image_id: props.comment_info.image_id,
      },
    }).then((response) => {
      if (response.data.result) {
        console.log(response);
      }
    });
  };

  return (
    <div className="card v-card v-sheet theme--light elevation-2">
      <div className="header">
        <div className="comment-container">
          <div className="v-avatar avatar">
            <img src="https://images.unsplash.com/photo-1490894641324-cfac2f5cd077?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=70"></img>
          </div>
          <span className="displayName title">
            {props.comment_info.commenter}
          </span>{" "}
          <span className="displayName caption">
            {props.comment_info.created_at}
          </span>
          <IconButton onClick={handleReplyClicked}>
            <ReplyIcon />
          </IconButton>
          {deleteButton}
        </div>
        <div className="wrapper comment">
          <p>{props.comment_info.comment}</p>
        </div>

        {show_reply_form ? (
          <div className="reply_form">
            <form onSubmit={handleReplySubmitted}>
              <div>
                <input
                  type="reply"
                  id="reply_input"
                  value={reply_input}
                  onChange={(e) => set_reply_input(e.target.value)}
                />
              </div>
            </form>
          </div>
        ) : null}

        {has_replies ? (
          <div className="reply_form">
            <p>See replies</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
