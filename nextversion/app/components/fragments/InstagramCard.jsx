"use client";
import { Link } from "next/link";
import React, { useEffect, useState } from "react";

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
    <div className="w-full py-3 flex flex-col gap-2 text-[15px] sm:w-[300px] border-b-[2px] border-accent">
      <Link href={`/dashboard/edit/instagram/${data.id}`}>
        <div className="title w-full">
          <p>{data.title} ( instagram )</p>
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
