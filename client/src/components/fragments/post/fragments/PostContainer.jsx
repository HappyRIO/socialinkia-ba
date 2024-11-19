import {
  Facebook,
  Image,
  Instagram,
  ReplaceAll,
  Settings,
  Store,
  Video,
  CassetteTape,
  CircleOff,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PostContainer({ data }) {
  const { fbook, insta, gmb } = data.platform;
  // Determine text color based on status
  const textColor =
    data.status === "failed"
      ? "bg-red-500"
      : data.status === "published"
      ? "bg-green-500"
      : "bg-background"; // Default color for scheduled or other statuses

  // Calculate the number of true platforms
  const platformCount = [fbook, insta, gmb].filter(Boolean).length;
  const isButtonEnabled =
    data.status === "scheduled" || data.status === "failed";

  return (
    // ${textColor}
    <div
      className={`${textColor} post-lister  w-full gap-1 flex text-sm flex-col md:flex-row justify-center bg-background p-2 rounded-lg`}
    >
      <div className="small-content gap-1 flex flex-row">
        {/* Platform Icon */}
        <div className="content-platform bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
          {platformCount > 1 ? (
            <ReplaceAll />
          ) : (
            <>
              {fbook && <Facebook />}
              {insta && <Instagram />}
              {gmb && <Store />}
            </>
          )}
        </div>

        {/* Image Icon */}
        <div className="content-type bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
          {data.images.length > 0 && data.videos.length > 0 ? (
            <CassetteTape />
          ) : data.images.length > 0 ? (
            <Image />
          ) : data.videos.length > 0 ? (
            <Video />
          ) : (
            <CircleOff />
          )}
        </div>

        {/* Image Preview */}
        <div className="content-preview bg-background2 aspect-square w-[50px] overflow-hidden rounded-lg">
          {data.videos.length > data.images.length ? (
            <video
              className="object-cover object-center w-full h-full rounded-lg"
              controls
            >
              <source src={data.videos[0]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              className="object-cover object-center w-full h-full rounded-lg"
              src={
                data.images.length > 0
                  ? data.images[0]
                  : "https://placehold.co/600x400?text=No+Media"
              }
              alt={data.images.length > 0 ? "Post image" : "No image available"}
            />
          )}
        </div>

        {/* Release Date */}
        <div className="content-release-date text-center flex flex-col justify-center items-center px-1 bg-background2 rounded-lg">
          <p>{new Date(data.uploadDate).toLocaleDateString()}</p>
          <p>{new Date(data.uploadDate).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Post Text with Conditional Color */}
      <div className={`content-title w-full px-1 bg-background2 rounded-lg`}>
        <p className={`line-clamp-2`}>{data.text}</p>
      </div>

      {/* Settings Icon */}
      <div className="pending-post-settings p-1 cursor-pointer flex justify-center items-center rounded-lg bg-background2">
        <Link
          className="w-full h-full cursor-pointer flex justify-center items-center"
          to={`/dashboard/posts/edit/${data._id}`}
        >
          <button
            className="w-full cursor-pointer h-full flex justify-center items-center"
            disabled={!isButtonEnabled}
          >
            <Settings />
          </button>
        </Link>
      </div>
    </div>
  );
}
