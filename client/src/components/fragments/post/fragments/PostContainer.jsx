import { Facebook, Image, Instagram, Settings, Store } from "lucide-react";

export default function PostContainer({ data }) {
  return (
    <div className="post-lister w-full gap-1 flex text-sm flex-col md:flex-row justify-center bg-background p-2 rounded-lg">
      <div className="small-content gap-1 flex flex-row">
        {/* Platform Icon */}
        <div className="content-platform bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
          {data.platform.fbook && <Facebook />}
          {data.platform.insta && <Instagram />}
          {data.platform.gmb && <Store />}
        </div>

        {/* Image Icon */}
        <div className="content-type bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
          {data.images.length > 0 && <Image />}
        </div>

        {/* Image Preview */}
        <div className="content-preview bg-background2 aspect-square w-[50px] overflow-hidden rounded-lg">
          {data.images.length > 0 ? (
            <img
              className="object-cover object-center w-full h-full rounded-lg"
              src={data.images[0]}
              alt="Post image"
            />
          ) : (
            <img
              className="object-cover object-center w-full h-full rounded-lg"
              src="https://placehold.co/600x400?text=No+Image"
              alt="No image available"
            />
          )}
        </div>

        {/* Release Date */}
        <div className="content-release-date text-center flex flex-col justify-center items-center px-1 bg-background2 rounded-lg">
          <p>{new Date(data.uploadDate).toLocaleDateString()}</p>
          <p>{new Date(data.uploadDate).toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Post Text */}
      <div className="content-title w-full px-1 bg-background2 rounded-lg">
        <p className="line-clamp-2">{data.text}</p>
      </div>

      {/* Settings Icon */}
      <div className="pending-post-settings p-1 cursor-pointer flex justify-center items-center rounded-lg bg-background2">
        <Settings />
      </div>
    </div>
  );
}
