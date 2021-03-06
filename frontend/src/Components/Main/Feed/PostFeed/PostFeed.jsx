import React, { useContext, useRef, useState } from "react";
import imageToImport from "../../../../Images/default-user-image.png";
import { Album, EmojiEmotions, LocationCity } from "@material-ui/icons";
import "./PostFeed.css";
import { AuthContext } from "../../../../context/AuthContext";
import Api from "../../../../config/axios";

export default function PostFeed() {
  const { user } = useContext(AuthContext);
  const content = useRef();
  const [file, setFile] = useState();

  const HandleSubmit = async (e) => {
    e.preventDefault();

    var newPost = {
      userId: user._id,
      content: content.current.value,
    };
    if (file) {
      const data = new FormData();

      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);

      console.log(fileName);

      newPost.notePicture = fileName;

      try {
        await Api.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await Api.post("/home/create", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }

    content.current.value = "";
  };

  return (
    <form className="feed__post" onSubmit={HandleSubmit}>
      <div className="feed__top">
        <div className="post__image">
          <img src={user.profilePicture || imageToImport} alt="profile" />
        </div>
        <div className="feed__input">
          <input
            placeholder={`What's in your mind ${user.username} ?`}
            ref={content}
          />
        </div>
      </div>

      <hr />
      <div className="logo__container">
        <label htmlFor="file" className="feed__logo">
          <Album className="logo" />
          <span>Photo ou Video</span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            accept=".png , .jpeg , .jpg"
            onChange={(e) => {
              const file = e.target.files[0];
              setFile(file);
            }}
          />
        </label>
        <li className="feed__logo">
          <LocationCity className="logo" />
          <span>Localisation</span>
        </li>
        <li className="feed__logo">
          <EmojiEmotions className="logo" />
          <span>Emotions</span>
        </li>
        <button className="feed__post__button" type="submit">
          Poster !
        </button>
      </div>
    </form>
  );
}
