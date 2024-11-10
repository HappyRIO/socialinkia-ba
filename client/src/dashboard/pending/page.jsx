import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { useEffect, useState } from "react";
import InstagramCard from "../../components/fragments/InstagramCard";
import FacebookCard from "../../components/fragments/FacebookCard";

export default function Pending() {
  const [searchPendingPost, setsearchPendingPost] = useState("");
  const [showSocial, setShowSocial] = useState({
    all: true,
    fbook: false,
    insta: false,
  });
  const [insta, setInsta] = useState([]);
  const [faceb, setFaceb] = useState([]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    // Update the state based on the selected value
    setShowSocial({
      all: selectedValue === "all",
      fbook: selectedValue === "fbook",
      insta: selectedValue === "insta",
    });
  };

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

  function handleSearchTerm(event) {
    setsearchPendingPost(event.target.value);
  }

  // Filter the posts based on the search term
  const filteredInsta = insta.filter((post) =>
    post.title.toLowerCase().includes(searchPendingPost.toLowerCase())
  );
  const filteredFaceb = faceb.filter((post) =>
    post.title.toLowerCase().includes(searchPendingPost.toLowerCase())
  );

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"Pending post"} />
      </div>
      <div className="contentzone pt-3 px-2 ml-0 sm:ml-64 w-full flex flex-col gap-3 justify-center items-center">
        <div
          id="createCustomCanvas"
          className="w-full py-10 shadow-lg bg-background2 rounded-lg px-2 flex gap-2 flex-row justify-center items-center overflow-x-visible"
        >
          <div className="cutomeCanvasCreator flex flex-col gap-2">
            <div className="inputZone flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col text-center gap-2">
                <label htmlFor="searchterm" className="text-xl">
                  search post
                </label>
                <input
                  className="px-2 p-1 rounded-lg border-[2px] border-accent text-accent forced:border-primary"
                  onChange={handleSearchTerm}
                  type="text"
                  name="searchterm"
                  id="searchterm"
                  value={searchPendingPost}
                  placeholder="search post ...."
                />
              </div>
              <div className="selectionZone flex flex-col gap-2">
                <label htmlFor="socialSelect" className="text-xl">
                  Select platform
                </label>
                <select
                  id="socialSelect"
                  className="rounded-lg p-2 text-center text-accent"
                  onChange={handleChange}
                >
                  <option className="text-text" value="all">
                    All
                  </option>
                  <option className="text-text" value="fbook">
                    Facebook
                  </option>
                  <option className="text-text" value="insta">
                    Instagram
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="pendingtop w-full">
          <div className="w-full text-center text-3xl font-bold">
            <h1>Pending Posts</h1>
          </div>
          <div className="social-grid-zone w-full px-2">
            <div
              id="social-grid"
              className="w-full grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {showSocial.all ? (
                <>
                  {filteredInsta.map((data, index) => (
                    <InstagramCard key={index} data={data} />
                  ))}
                  {filteredFaceb.map((data, index) => (
                    <FacebookCard data={data} key={index} />
                  ))}
                </>
              ) : showSocial.fbook ? (
                filteredFaceb.map((data, index) => (
                  <FacebookCard data={data} key={index} />
                ))
              ) : showSocial.insta ? (
                filteredInsta.map((data, index) => (
                  <InstagramCard key={index} data={data} />
                ))
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
