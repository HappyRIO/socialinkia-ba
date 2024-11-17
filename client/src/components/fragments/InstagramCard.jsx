import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Instagram } from "lucide-react";

// eslint-disable-next-line react/prop-types
export default function InstagramCard({ data }) {
  const [timeRemaining, setTimeRemaining] = useState({
    months: 0,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = new Date();
      const targetDate = new Date(data.targetDate); // Assuming data has a targetDate field
      const diff = targetDate - now;

      if (diff > 0) {
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30)); // Approx. 30 days per month
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeRemaining({ months, hours, minutes });
      } else {
        clearInterval(countdownInterval);
        setTimeRemaining({ months: 0, hours: 0, minutes: 0 });
      }
    }, 1000 * 60); // Update every minute

    return () => clearInterval(countdownInterval);
  }, [data.targetDate]); // Trigger effect when targetDate changes

  return (
    <div className="w-full shadow-md sm:rounded-lg sm:px-2 py-3 flex flex-col gap-2 text-[15px] border-b-[2px] border-accent">
      <Link to={`/dashboard/posts/edit/${data._id}`}>
        <div className="title w-full flex items-center gap-2 ">
          <p className="text-left truncate w-full">{data.text}</p>
          <span>
            <Instagram />
          </span>
        </div>
        <div className="image rounded-md overflow-hidden w-full">
          <img
            className="w-full object-center aspect-video object-cover"
            src={
              data?.images?.[0] ||
              "https://placehold.co/600x400/d8603b/white?text=no\nmedia"
            }
            alt=""
          />
        </div>
        <div className="reaction w-full px-2 flex flex-row justify-between items-center">
          <div className="like">
            <p className="flex flex-row gap-2">{timeRemaining.months} months</p>
          </div>
          <div className="comment">
            <p className="flex flex-row gap-2">{timeRemaining.hours} hours</p>
          </div>
          <div className="share">
            <p className="flex flex-row gap-2">
              {timeRemaining.minutes} minutes
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
