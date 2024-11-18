import { useState } from "react";
import PostContainer from "./fragments/PostContainer";

export default function AllPosts() {
  // State for search query and filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full flex flex-col sm:flex-row justify-center items-center px-2 rounded-lg">
        {/* Search Input */}
        <div className="w-full flex py-4 justify-center">
          <input
            type="text"
            placeholder="Search posts..."
            className="border px-4 py-2 rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="select-option py-2 w-full flex justify-center">
          <select
            className="border px-4 py-2 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="canceled">Canceled</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="w-full gap-2 flex flex-col justify-center items-center">
        <PostContainer />
        <PostContainer />
        <PostContainer />
        <PostContainer />
        <PostContainer />
        <PostContainer />
        <PostContainer />
        <PostContainer />
      </div>
    </div>
  );
}
