"use client";
import Toaster from "../../fragments/Toast";
import Link from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Hero() {
  return (
    <div>
      <div className="w-full flex justify-center items-center">
        <Toaster type={"sucssec"} message={"kings test for hornor"} />
      </div>
      <Link href={"/dashboard"}>
        <button className="bg-accent hover:bg-primary text-text rounded-lg px-5 py-1">
          <p>dashboard</p>
        </button>
      </Link>
    </div>
  );
}
