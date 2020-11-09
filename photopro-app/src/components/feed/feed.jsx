import React, { useState } from "react";
import "./feed.css";
import ImageCard from "./ImageCard/ImageCard";
import BookmarkModal from "../modal/BookmarkModal";

const Feed = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [photoIdBookmarked, setPhotoIdBookmarked] = useState(0);

  const imgs = props.foundImages.map((img) => {
    return (
      <ImageCard
        key={img.id}
        image={img}
        openBookmarkModal={modalIsOpen}
        setOpenBookmarkModal={setModalIsOpen}
        setPhotoId={setPhotoIdBookmarked}
      />
    );
  });

  return (
    <React.Fragment>
      <h2>Found Images: {props.foundImages.length}</h2>
      <div className="image-list">{imgs}</div>
      <BookmarkModal
        openModal={modalIsOpen}
        setOpenModal={setModalIsOpen}
        photoId={photoIdBookmarked}
      ></BookmarkModal>
    </React.Fragment>
  );
};

export default Feed;
