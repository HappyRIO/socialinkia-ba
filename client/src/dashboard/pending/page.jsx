import ResponsiveSidebar from "../../components/navigation/ResponsiveSidebar";
import { useEffect, useState } from "react";
import InstagramCard from "../../components/fragments/InstagramCard";
import FacebookCard from "../../components/fragments/FacebookCard";
import GeneralPost from "../../components/fragments/GeneralPost"; // Assuming GeneralPost is the card component you want to use

export default function Pending() {
  const [searchPendingPost, setSearchPendingPost] = useState("");
  const [showSocial, setShowSocial] = useState({
    all: true,
    fbook: false,
    insta: false,
  });
  const [allPosts, setAllPosts] = useState([]); // Store all posts fetched once
  const [filteredPosts, setFilteredPosts] = useState([]); // Store filtered posts

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setShowSocial({
      all: selectedValue === "all",
      fbook: selectedValue === "fbook",
      insta: selectedValue === "insta",
    });
  };

  // Fetch all posts once on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/all`,
          {
            credentials: "include",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data.posts);
          const posts = Array.isArray(data.posts) ? data.posts : [data.posts];
          setAllPosts(posts);
          setFilteredPosts(posts); // Initially show all posts
        } else {
          console.error("Failed to fetch posts");
          setAllPosts([]); // Default to an empty array if the fetch fails
          setFilteredPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setAllPosts([]); // Default to an empty array on error
        setFilteredPosts([]); // Clear any existing filtered posts
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on platform selection
  useEffect(() => {
    let filtered = [...allPosts];

    if (showSocial.insta) {
      filtered = filtered.filter((post) => post.platform.insta);
    } else if (showSocial.fbook) {
      filtered = filtered.filter((post) => post.platform.fbook);
    } else if (showSocial.all) {
      filtered = filtered.filter(
        (post) =>
          post.platform.both || post.platform.insta || post.platform.fbook
      );
    }

    // Always show posts where both platforms are selected, regardless of other filters
    if (showSocial.all) {
      filtered = filtered.filter(
        (post) =>
          post.platform.both || post.platform.insta || post.platform.fbook
      );
    }

    if (searchPendingPost) {
      filtered = filtered.filter((post) =>
        post.text.toLowerCase().includes(searchPendingPost.toLowerCase())
      );
    }

    setFilteredPosts(filtered); // Set filtered posts based on platform and search
  }, [showSocial, allPosts, searchPendingPost]);

  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"Pending post"} />
      </div>
      <div className="contentzone pt-3 px-2 ml-0 sm:ml-64 w-full">
        <div className="w-full flex justify-between">
          <div className="flex items-center">
            <input
              type="text"
              value={searchPendingPost}
              onChange={(e) => setSearchPendingPost(e.target.value)}
              placeholder="Search posts..."
              className="border px-4 py-2 rounded-md"
            />
          </div>
          <div className="flex items-center">
            <select
              onChange={handleChange}
              className="border px-4 py-2 rounded-md"
            >
              <option value="all">All</option>
              <option value="insta">Instagram</option>
              <option value="fbook">Facebook</option>
            </select>
          </div>
        </div>

        <div className="pt-4 grid gap-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post._id} className="mb-4">
                {/* Render GeneralPost if post is available */}
                <GeneralPost data={post} />
                {/* Or render specific InstagramCard and FacebookCard if needed */}
                {post.platform.insta && <InstagramCard data={post} />}
                {post.platform.fbook && <FacebookCard data={post} />}
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
}
