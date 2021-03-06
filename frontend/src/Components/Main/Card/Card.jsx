import React, { useContext, useEffect, useState } from "react";
import defaultPic from "../../../Images/default-user-image.png";
import { MoreHoriz, ThumbUp } from "@material-ui/icons";
import "./Card.css";
import * as timeago from "timeago.js";
import { Link } from "react-router-dom";
import api from "../../../config/axios";
import { AuthContext } from "../../../context/AuthContext";

export default function Card({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  var [likesCount, setLikesCount] = useState(post.likes.length);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  useEffect(() => {
    api.get(`/user?userId=${post.userId}`).then((res) => {
      setUser(res.data);
    });
  }, [post.userId]);
  const IF = process.env.REACT_APP_IMAGES_FOLDER;

  //check si le user a déjà like un post ou pas
  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  var HandleDelete = async (id) => {
    try {
      const res = await api.delete(`/home/${id}`, {
        data: { userId: currentUser._id },
      });
      console.log(res.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  var HandleLikeClick = async () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    try {
      const res = await api.patch("/home/like/" + post._id, {
        userId: currentUser._id,
      });
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="card">
      <div className="card__header">
        <div className="card__profile">
          <Link to={`/profile/${user.username}`}>
            <img
              src={user.profilePicture || defaultPic}
              className="card__profile__image"
              alt="profile"
            />
          </Link>

          <span>{user.username}</span>
          <small>Updated {timeago.format(post.date)}</small>
        </div>
        <div className="card__more">
          <MoreHoriz className="more" />
          <div className="card__delete">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <button
                onClick={() => {
                  HandleDelete(post._id);
                }}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="card__body">
        <p>{post.content}</p>
        <div>
          {post.notePicture == null ? (
            <div />
          ) : (
            <img
              src={IF + post.notePicture}
              className="card__content__image"
              alt="content "
            />
          )}
        </div>
      </div>
      <div className="card__footer">
        <div className="card__footer__logo">
          <ThumbUp
            className="thumb"
            style={{ background: isLiked ? "rgb(126, 126, 253)" : "#a8a8a8" }}
            onClick={HandleLikeClick}
          />
          <span className="post__liked">{likesCount} People like it</span>
        </div>
        <div className="post__comment">
          <p>{post.comments} comments</p>
        </div>
      </div>
    </div>
  );
}
