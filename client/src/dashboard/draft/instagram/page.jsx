import InstagramCard from "../../../components/fragments/InstagramCard";
import { Link, useNavigate } from "react-router-dom";
import { Menu, CircleX } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function InstagramDraft() {
  const [insta, setInsta] = useState([]);
  const [openmenu, setOpenMenu] = useState(false);
  const navigate = useNavigate(); // Use useNavigate instead of useRouter

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
  }, []);

  function handleMenu() {
    setOpenMenu(!openmenu);
  }

  function handleDropdownChange(event) {
    const value = event.target.value;
    if (value === "all") {
      navigate("/dashboard/draft");
    } else if (value === "instagram") {
      window.location.reload();
    } else if (value === "facebook") {
      navigate("/dashboard/draft/facebook");
    }
  }

  return (
    <div className="dashboard flex flex-col w-full justify-center items-center">
      <div className="social w-full">
        <div className="social-bar py-3 flex w-full px-2 justify-between items-center flex-row">
          <div className="grid-swaper-button w-fit">
            <select
              className="rounded-lg p-2 bg-text text-background"
              name="dropdown"
              id="dropdown"
              onChange={handleDropdownChange}
            >
              <option value="instagram">Instagram</option>
              <option value="all">All</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>
          <div className="sm:hidden w-fit">
            <p onClick={handleMenu} id="menu-btn">
              <Menu />
            </p>
          </div>
          <div className="navigation w-fit">
            {openmenu ? (
              <div className="mobile-navigation py-3 sm:hidden absolute left-0 top-0 flex gap-2 bg-accent text-text w-full flex-col justify-center items-center">
                <p onClick={handleMenu}>
                  <CircleX />
                </p>
                <Link to="/dashboard/draft/instagram">instagram</Link>
                <Link to="/dashboard/draft/facebook">facebook</Link>
                <Link to="/dashboard/design">design</Link>
              </div>
            ) : (
              <div className="desktop-navigation hidden sm:flex w-full gap-3 flex-row justify-center items-center">
                <Link to="/dashboard/draft/instagram">instagram</Link>
                <Link to="/dashboard/draft/facebook">facebook</Link>
                <Link to="/dashboard/design">design</Link>
              </div>
            )}
          </div>
        </div>
        <div className="section-title w-full text-md text-center py-4">
          <h1 className="text-3xl">Instagram</h1>
          <p>pending posts</p>
        </div>
        <div className="social-grid-zone px-2">
          <div className="w-full grid gap-2 xsm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {insta.map((data, index) => (
              <InstagramCard key={index} data={data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
