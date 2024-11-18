// TemplatePage
import { Link } from "react-router-dom";
import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { useEffect, useState } from "react";

export default function TemplatePage() {
  const [customSize, setCustomSize] = useState({
    height: 0,
    width: 0,
  });
  const [imageData, setImageDate] = useState([]);

  const fakeImageData = [
    {
      height: 400,
      width: 600,
      id: 1,
      platform: "Facebook",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/3b5998?font=roboto&text=Facebook",
      description: "Connect with friends and the world around you.",
    },
    {
      height: 600,
      width: 800,
      id: 2,
      platform: "Facebook",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/3b5998?font=roboto&text=Facebook",
      description: "Connect with friends and the world around you.",
    },
    {
      height: 300,
      width: 400,
      id: 3,
      platform: "Facebook",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/3b5998?font=roboto&text=Facebook",
      description: "Connect with friends and the world around you.",
    },

    // Twitter (varied sizes)
    {
      height: 400,
      width: 600,
      id: 4,
      platform: "Twitter",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/1da1f2?font=roboto&text=Twitter",
      description: "See what’s happening in the world right now.",
    },
    {
      height: 600,
      width: 800,
      id: 5,
      platform: "Twitter",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/1da1f2?font=roboto&text=Twitter",
      description: "See what’s happening in the world right now.",
    },
    {
      height: 300,
      width: 400,
      id: 6,
      platform: "Twitter",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/1da1f2?font=roboto&text=Twitter",
      description: "See what’s happening in the world right now.",
    },

    // Instagram (varied sizes)
    {
      height: 400,
      width: 600,
      id: 7,
      platform: "Instagram",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/e4405f?font=roboto&text=Instagram",
      description: "Share photos and videos with friends.",
    },
    {
      height: 600,
      width: 800,
      id: 8,
      platform: "Instagram",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/e4405f?font=roboto&text=Instagram",
      description: "Share photos and videos with friends.",
    },
    {
      height: 300,
      width: 400,
      id: 9,
      platform: "Instagram",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/e4405f?font=roboto&text=Instagram",
      description: "Share photos and videos with friends.",
    },

    // LinkedIn (varied sizes)
    {
      height: 400,
      width: 600,
      id: 10,
      platform: "LinkedIn",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/0077b5?font=roboto&text=LinkedIn",
      description: "Manage your professional identity.",
    },
    {
      height: 600,
      width: 800,
      id: 11,
      platform: "LinkedIn",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/0077b5?font=roboto&text=LinkedIn",
      description: "Manage your professional identity.",
    },
    {
      height: 300,
      width: 400,
      id: 12,
      platform: "LinkedIn",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/0077b5?font=roboto&text=LinkedIn",
      description: "Manage your professional identity.",
    },

    // TikTok (varied sizes)
    {
      height: 400,
      width: 600,
      id: 13,
      platform: "TikTok",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/69c9d0?font=roboto&text=TikTok",
      description: "Create and discover short, fun videos.",
    },
    {
      height: 600,
      width: 800,
      id: 14,
      platform: "TikTok",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/69c9d0?font=roboto&text=TikTok",
      description: "Create and discover short, fun videos.",
    },
    {
      height: 300,
      width: 400,
      id: 15,
      platform: "TikTok",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/69c9d0?font=roboto&text=TikTok",
      description: "Create and discover short, fun videos.",
    },

    // Snapchat (varied sizes)
    {
      height: 400,
      width: 600,
      id: 16,
      platform: "Snapchat",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/fffc00?font=roboto&text=Snapchat",
      description: "Send a Snap, share a Story.",
    },
    {
      height: 600,
      width: 800,
      id: 17,
      platform: "Snapchat",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/fffc00?font=roboto&text=Snapchat",
      description: "Send a Snap, share a Story.",
    },
    {
      height: 300,
      width: 400,
      id: 18,
      platform: "Snapchat",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/fffc00?font=roboto&text=Snapchat",
      description: "Send a Snap, share a Story.",
    },

    // Pinterest (varied sizes)
    {
      height: 400,
      width: 600,
      id: 19,
      platform: "Pinterest",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/e60023?font=roboto&text=Pinterest",
      description: "Discover new ideas to try and share.",
    },
    {
      height: 600,
      width: 800,
      id: 20,
      platform: "Pinterest",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/e60023?font=roboto&text=Pinterest",
      description: "Discover new ideas to try and share.",
    },
    {
      height: 300,
      width: 400,
      id: 21,
      platform: "Pinterest",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/e60023?font=roboto&text=Pinterest",
      description: "Discover new ideas to try and share.",
    },

    // YouTube (varied sizes)
    {
      height: 400,
      width: 600,
      id: 22,
      platform: "YouTube",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/ff0000?font=roboto&text=YouTube",
      description: "Watch, like, and share videos.",
    },
    {
      height: 600,
      width: 800,
      id: 23,
      platform: "YouTube",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/ff0000?font=roboto&text=YouTube",
      description: "Watch, like, and share videos.",
    },
    {
      height: 300,
      width: 400,
      id: 24,
      platform: "YouTube",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/ff0000?font=roboto&text=YouTube",
      description: "Watch, like, and share videos.",
    },

    // Reddit (varied sizes)
    {
      height: 400,
      width: 600,
      id: 25,
      platform: "Reddit",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/ff4500?font=roboto&text=Reddit",
      description: "Dive into communities and discussions.",
    },
    {
      height: 600,
      width: 800,
      id: 26,
      platform: "Reddit",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/ff4500?font=roboto&text=Reddit",
      description: "Dive into communities and discussions.",
    },
    {
      height: 300,
      width: 400,
      id: 27,
      platform: "Reddit",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/ff4500?font=roboto&text=Reddit",
      description: "Dive into communities and discussions.",
    },

    // WhatsApp (varied sizes)
    {
      height: 400,
      width: 600,
      id: 28,
      platform: "WhatsApp",
      imageUrl:
        "https://placehold.co/600x400/e7e2e1/25d366?font=roboto&text=WhatsApp",
      description: "Send messages and make calls anywhere.",
    },
    {
      height: 600,
      width: 800,
      id: 29,
      platform: "WhatsApp",
      imageUrl:
        "https://placehold.co/800x600/e7e2e1/25d366?font=roboto&text=WhatsApp",
      description: "Send messages and make calls anywhere.",
    },
    {
      height: 300,
      width: 400,
      id: 30,
      platform: "WhatsApp",
      imageUrl:
        "https://placehold.co/400x300/e7e2e1/25d366?font=roboto&text=WhatsApp",
      description: "Send messages and make calls anywhere.",
    },
  ];

  useEffect(() => {
    setImageDate(fakeImageData);
  }, []);

  function handleCustomSize(event) {
    const { name, value } = event.target;
    setCustomSize((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleCustomSizeRedirect() {
    if (customSize.height === 0 || customSize.width === 0) {
      alert("Please add both dimensions.");
    } else {
      window.location.href = `/dashboard/create/design?height=${customSize.height}&width=${customSize.width}`;
    }
  }

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"Create template"} />
      </div>
      <div className="contentzone pt-3 px-2 ml-0 sm:ml-64 w-full flex flex-col gap-3 justify-center items-center">
        <div
          id="createCustomCanvas"
          className="w-full py-3 shadow-lg bg-background2 rounded-lg px-2 flex gap-2 flex-row justify-center items-center overflow-x-visible"
        >
          <div className="w-full gap-2 flex flex-col sm:flex-row">
            <div className="cutomeCanvasCreator flex flex-col gap-2">
              <div className="inputZone flex flex-col sm:flex-row gap-2">
                <div className="flex flex-col text-center">
                  <label htmlFor="height">height</label>
                  <input
                    className="px-2 rounded-lg border-[2px] border-accent forced:border-primary"
                    onChange={handleCustomSize}
                    type="number"
                    name="height"
                    id="height"
                    value={customSize.height}
                    placeholder="Height"
                  />
                </div>
                <div className="flex flex-col text-center">
                  <label htmlFor="width">width</label>
                  <input
                    className="px-2 rounded-lg border-[2px] border-accent forced:border-primary"
                    onChange={handleCustomSize}
                    type="number"
                    name="width"
                    id="width"
                    value={customSize.width}
                    placeholder="Width"
                  />
                </div>
              </div>
              <button
                className="px-4 bg-accent text-white hover:bg-primary rounded-lg"
                onClick={handleCustomSizeRedirect}
              >
                <p>Create</p>
              </button>
            </div>
            <div className="w-full flex justify-center items-center">
              <Link to={"/dashboard/create/post"}>
                <button className="p-5 text-white bg-accent rounded-lg">
                  <p>make a post</p>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="samplecardsZone w-full columns-2 md:columns-4 gap-4">
          {imageData.map((data, index) => (
            <Link
              key={index}
              to={`/dashboard/create/design?height=${data.height}&width=${data.width}`} // Correct query parameter format
            >
              <img
                className="rounded-lg mb-4 shadow-md w-full object-cover"
                src={data.imageUrl}
                alt={data.description}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
