import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [insta, setInsta] = useState([]);
  const [faceb, setFaceb] = useState([]);
  const [openmenu, setOpenmenu] = useState(false);
  const navigate = useNavigate();

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

  function handleMenu() {
    setOpenmenu(!openmenu);
  }

  function handleDropdownChange(event) {
    const value = event.target.value;
    if (value === "all") {
      window.location.reload();
    } else if (value === "instagram") {
      navigate("/dashboard/draft/instagram");
    } else if (value === "facebook") {
      navigate("/dashboard/draft/facebook");
    }
  }

  return (
    <div className="dashboard flex flex-col w-full justify-center items-center">
      <div className="profilesection w-full">
        <div className="pimage">
          <img className="rounded-full w-[150px] bg-primary" src="" alt="" />
        </div>
        <div className="fewdetails">
          <div className="client_company_name"></div>
          <div className="subscription_status"></div>
        </div>
      </div>
      <div className="pendingtop">
        <h1>currently updating</h1>
      </div>
    </div>
  );
}
