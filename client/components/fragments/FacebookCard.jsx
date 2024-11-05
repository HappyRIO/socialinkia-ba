import React from "react";

export default function FacebookCard({ data }) {
  return (
    <div>
      <div className="title">
        <p>{data.title}</p>
      </div>
      <div className="image">
        <img src={data.image} alt="" />
      </div>
      <div className="reaction flex flex-row justify-center items-center">
        <div className="like">
          <p>{data.like}</p>
        </div>
        <div className="comment">
          <p>{data.comment}</p>
        </div>
        <div className="share">
          <p>{data.share}</p>
        </div>
      </div>
    </div>
  );
}
