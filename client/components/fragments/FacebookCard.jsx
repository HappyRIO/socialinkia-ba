import React from "react";
import { ThumbsUp, MessageSquareText, ExternalLink } from "lucide-react";

export default function FacebookCard({ data }) {
  return (
    <div className="w-full py-3 flex flex-col gap-2 text-[15px] sm:w-[300px] border-b-[2px] border-accent">
      <div className="title w-full">
        <p>{data.title}</p>
      </div>
      <div className="image rounded-md overflow-hidden w-full">
        <img
          className="w-full object-center object-cover"
          src={data.image}
          alt=""
        />
      </div>
      <div className="reaction w-full px-2 flex flex-row justify-between items-center">
        <div className="like">
          <p className="flex flex-row gap-2">
            <ThumbsUp /> {data.like}
          </p>
        </div>
        <div className="comment">
          <p className="flex flex-row gap-2">
            <MessageSquareText />
            {data.comment}
          </p>
        </div>
        <div className="share">
          <p className="flex flex-row gap-2">
            <ExternalLink />
            {data.share}
          </p>
        </div>
      </div>
    </div>
  );
}
