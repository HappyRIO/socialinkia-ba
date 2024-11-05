"use client";
import FacebookCard from "@/components/fragments/FacebookCard";
import InstagramCard from "@/components/fragments/InstagramCard";
import Link from "next/link";
import { Menu } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [insta, setInsta] = useState([]);
  const [faceb, setFaceb] = useState([]);

  const fake = [
    {
      title: "The Beauty of Nature",
      like: 120,
      share: 45,
      comment: 10,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Tech Innovations of 2023",
      like: 200,
      share: 75,
      comment: 25,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Healthy Living Tips",
      like: 160,
      share: 60,
      comment: 30,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Top 10 Travel Destinations",
      like: 350,
      share: 100,
      comment: 15,
      image: "https://placehold.co/600x400",
    },
    {
      title: "The Future of Space Exploration",
      like: 280,
      share: 90,
      comment: 50,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Mindfulness and Meditation",
      like: 200,
      share: 50,
      comment: 20,
      image: "https://placehold.co/600x400",
    },
    {
      title: "2023 Fashion Trends",
      like: 150,
      share: 40,
      comment: 12,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Celebrating Local Cuisine",
      like: 300,
      share: 110,
      comment: 28,
      image: "https://placehold.co/600x400",
    },
    {
      title: "The Impact of AI on Society",
      like: 420,
      share: 130,
      comment: 55,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Fitness and Wellness Routines",
      like: 260,
      share: 75,
      comment: 22,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Home Decor Ideas",
      like: 190,
      share: 65,
      comment: 18,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Exploring Renewable Energy",
      like: 230,
      share: 90,
      comment: 35,
      image: "https://placehold.co/600x400",
    },
    {
      title: "The World of Virtual Reality",
      like: 310,
      share: 120,
      comment: 45,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Essential Gardening Tips",
      like: 140,
      share: 55,
      comment: 30,
      image: "https://placehold.co/600x400",
    },
    {
      title: "The Art of Storytelling",
      like: 230,
      share: 80,
      comment: 14,
      image: "https://placehold.co/600x400",
    },
    {
      title: "The Benefits of Reading Daily",
      like: 240,
      share: 78,
      comment: 19,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Discovering Hidden Gems",
      like: 310,
      share: 92,
      comment: 37,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Understanding Cryptocurrency",
      like: 450,
      share: 200,
      comment: 60,
      image: "https://placehold.co/600x400",
    },
    {
      title: "The Joy of Cooking",
      like: 280,
      share: 67,
      comment: 27,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Digital Marketing Strategies",
      like: 300,
      share: 130,
      comment: 48,
      image: "https://placehold.co/600x400",
    },
    {
      title: "Embracing Minimalism",
      like: 190,
      share: 40,
      comment: 15,
      image: "https://placehold.co/600x400",
    },
  ];

  useEffect(() => {
    setInsta(fake);
    setFaceb(fake);
  }, []);

  function handlefbgrid() {
    const fbookgrid = document.getElementById("fbook-grid");
    const instagrid = document.getElementById("inst-grid");
    const socialgrid = document.getElementById("social-grid");

    if (fbookgrid && instagrid && socialgrid) {
      fbookgrid.classList.remove("hidden");
      fbookgrid.classList.add("grid");
      instagrid.classList.add("hidden");
      instagrid.classList.remove("grid");
      socialgrid.classList.add("hidden");
      socialgrid.classList.remove("grid");
    }
  }

  function handleiggrid() {
    const fbookgrid = document.getElementById("fbook-grid");
    const instagrid = document.getElementById("inst-grid");
    const socialgrid = document.getElementById("social-grid");

    if (fbookgrid && instagrid && socialgrid) {
      fbookgrid.classList.add("hidden");
      fbookgrid.classList.remove("grid");
      instagrid.classList.remove("hidden");
      instagrid.classList.add("grid");
      socialgrid.classList.add("hidden");
      socialgrid.classList.remove("grid");
    }
  }

  function handlesocialgrid() {
    const fbookgrid = document.getElementById("fbook-grid");
    const instagrid = document.getElementById("inst-grid");
    const socialgrid = document.getElementById("social-grid");

    if (fbookgrid && instagrid && socialgrid) {
      fbookgrid.classList.add("hidden");
      fbookgrid.classList.remove("grid");
      instagrid.classList.add("hidden");
      instagrid.classList.remove("grid");
      socialgrid.classList.add("grid");
      socialgrid.classList.remove("hidden");
    }
  }

  function handleDropdownChange(event) {
    const value = event.target.value;
    if (value === "all") {
      handlesocialgrid();
    } else if (value === "instagram") {
      handleiggrid();
    } else if (value === "facebook") {
      handlefbgrid();
    }
  }

  return (
    <div className="dashboard flex flex-col w-full justify-center items-center">
      <div className="section-title w-full text-md text-center mb-4">
        <h1>Dashboard</h1>
      </div>
      <div className="social">
        <div className="social-bar flex w-full px-2 justify-between items-center flex-row">
          <div className="grid-swaper-button">
            <select
              className="rounded-lg p-2 bg-text text-background"
              name="dropdown"
              id="dropdown"
              onChange={handleDropdownChange}
            >
              <option
                className="text-text bg-background border-b-[2px] border-accent"
                value="all"
              >
                All
              </option>
              <option
                className="text-text bg-background border-b-[2px] border-accent"
                value="instagram"
              >
                Instagram
              </option>
              <option
                className="text-text bg-background border-b-[2px] border-accent"
                value="facebook"
              >
                Facebook
              </option>
            </select>
          </div>
          <div className="sm:hidden w-fit">
            <p id="menu-btn">
              <Menu />
            </p>
          </div>
          <div className="navigation">
            <div className="desktop-navigation hidden sm:flex w-full gap-3 flex-row justify-center items-center">
              <Link href={"/dashboard/feed/instagram"}>instagram</Link>
              <Link href={"/dashboard/feed/facebook"}>facebook</Link>
              <Link href={"/dashboard/design"}>design</Link>
            </div>
            <div className="mobile-navigation sm:hidden absolute left-0 bottom-0 flex gap-2 bg-red-300 w-full flex-col justify-center items-center">
              <Link href={"/dashboard/feed/instagram"}>instagram</Link>
              <Link href={"/dashboard/feed/facebook"}>facebook</Link>
              <Link href={"/dashboard/design"}>design</Link>
            </div>
          </div>
        </div>
        <div className="social-grid-zone">
          <div
            id="social-grid"
            className="w-full grid gap-2 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {insta.map((data, index) => (
              <InstagramCard key={index} data={data} />
            ))}
            {faceb.map((data, index) => (
              <FacebookCard data={data} key={index} />
            ))}
          </div>
          <div
            id="inst-grid"
            className="w-full hidden gap-2 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {insta.map((data, index) => (
              <InstagramCard key={index} data={data} />
            ))}
          </div>
          <div
            id="fbook-grid"
            className="w-full hidden gap-2 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {faceb.map((data, index) => (
              <FacebookCard data={data} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
