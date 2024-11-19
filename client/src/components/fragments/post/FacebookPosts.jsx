// FacebookPosts
import { useEffect, useState } from "react";
import PostContainer from "./fragments/PostContainer";

export default function FacebookPosts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [allpost, setallpost] = useState([]);
  const [publisedpost, setpublisedpost] = useState([]);
  const [scheduledpost, setscheduledpost] = useState([]);
  const [failedpost, setfailedpost] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, scheduledRes, publishedRes, failedRes] =
          await Promise.all([
            fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/all`, {
              method: "GET",
              credentials: "include",
            }),
            fetch(
              `${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/scheduled`,
              {
                method: "GET",
                credentials: "include",
              }
            ),
            fetch(
              `${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/published`,
              {
                method: "GET",
                credentials: "include",
              }
            ),
            fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/posts/failed`, {
              method: "GET",
              credentials: "include",
            }),
          ]);

        const allData = await allRes.json();
        const scheduledData = await scheduledRes.json();
        const publishedData = await publishedRes.json();
        const failedData = await failedRes.json();

        // Filter posts where 'fbook' is true
        const filterFbookPosts = (posts) =>
          Array.isArray(posts)
            ? posts.filter((post) => post.platform.fbook)
            : [];

        setallpost(filterFbookPosts(allData.posts));
        setscheduledpost(filterFbookPosts(scheduledData.posts));
        setpublisedpost(filterFbookPosts(publishedData.posts));
        setfailedpost(filterFbookPosts(failedData.posts));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-col sm:flex-row justify-center items-center px-2 rounded-lg">
        <div className="w-full flex py-4 justify-center">
          <input
            type="text"
            placeholder="Search posts..."
            className="border px-4 py-2 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="select-option py-2 w-full flex justify-center">
          <select
            className="border px-4 py-2 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            {/* <option value="canceled">Canceled</option> */}
            <option className="text-red-500" value="failed">
              Failed
            </option>
          </select>
        </div>
      </div>

      <div className="w-full gap-2 flex flex-col justify-center items-center">
        {filter === "all" ? (
          <>
            {Array.isArray(allpost) &&
              allpost.map((data, index) => (
                <PostContainer key={index} data={data} />
              ))}
          </>
        ) : null}

        {filter === "scheduled" ? (
          <>
            {Array.isArray(scheduledpost) &&
              scheduledpost.map((data, index) => (
                <PostContainer key={index} data={data} />
              ))}
          </>
        ) : null}

        {filter === "published" ? (
          <>
            {Array.isArray(publisedpost) &&
              publisedpost.map((data, index) => (
                <PostContainer key={index} data={data} />
              ))}
          </>
        ) : null}

        {filter === "failed" ? (
          <>
            {Array.isArray(failedpost) &&
              failedpost.map((data, index) => (
                <PostContainer key={index} data={data} />
              ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
