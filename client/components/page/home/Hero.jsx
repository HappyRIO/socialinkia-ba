import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div>
      <Link href={"/dashboard"}>
        <button className="bg-primary text-text rounded-lg px-5 py-1">
          <p>dashboard</p>
        </button>
      </Link>
    </div>
  );
}
