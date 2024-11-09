import { useEffect, useState } from "react";
import InstagramCard from "../components/fragments/InstagramCard";
import FacebookCard from "../components/fragments/FacebookCard";
import ResponsiveSidebar from "../components/navigation/ResponsiveSidebar";

export default function Dashboard() {
  const [insta, setInsta] = useState([]);
  const [faceb, setFaceb] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

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
    async function fetchUserInfo() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/user/details`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        setUserInfo(data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    fetchUserInfo();
    setInsta(fake);
    setFaceb(fake);
  }, []);

  if (!userInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full gap-3 flex flex-row justify-center items-center">
      <div className="sidebar w-fit">
        <ResponsiveSidebar user={userInfo} />
      </div>
      <div className="main m-0 sm:ml-60 w-full">
        <div className="dashboard gap-3 pt-3 flex flex-col w-full justify-center items-center px-2">
          <div className="profilesection rounded-lg bg-background2 py-3 px-2 gap-2 flex flex-col w-full justify-center items-center">
            <div className="pimage w-[150px] rounded-full overflow-hidden">
              <img
                className="rounded-full w-full aspect-square overflow-hidden bg-primary object-cover object-center"
                src="https://placehold.co/600x400"
                alt=""
              />
            </div>
            <div className="userid text-sm">
              <p>User ID: {userInfo._id}</p>
            </div>
          </div>
          <div className="fewdetails p-2 w-full rounded-lg bg-background2">
            <div className="userid">
              <p>User ID: {userInfo._id}</p>
            </div>
            <div className="email">
              <p>Email: {userInfo.email}</p>
            </div>
            <div className="createdAt">
              <p>
                Account Created:{" "}
                {new Date(userInfo.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="subscription_status">
              <p>
                Subscription: {userInfo.subscription ? "Active" : "Inactive"}
              </p>
            </div>
            {userInfo.companyDetails && (
              <div className="companyDetails">
                <p>Company Name: {userInfo.companyDetails.name}</p>
                <p>Founded: {userInfo.companyDetails.companyCreationDate}</p>
                <p>Slogan: {userInfo.companyDetails.slogan}</p>
                <p>Employees: {userInfo.companyDetails.numEmployees}</p>
                <p>Contact Info: {userInfo.companyDetails.contactInfo}</p>
                <p>
                  Business Purpose: {userInfo.companyDetails.businessPurpose}
                </p>
                <p>Language: {userInfo.companyDetails.preferredLanguage}</p>
                <div className="photos">
                  <p>Photos:</p>
                  {userInfo.companyDetails.photos.map((photo, index) => (
                    <img key={index} src={photo} alt={`Photo ${index + 1}`} />
                  ))}
                </div>
              </div>
            )}
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
                {insta.map((data, index) => (
                  <InstagramCard key={index} data={data} />
                ))}
                {faceb.map((data, index) => (
                  <FacebookCard data={data} key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
