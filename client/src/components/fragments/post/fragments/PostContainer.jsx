import { Facebook, Image, Settings } from "lucide-react";

export default function PostContainer() {
  return (
    <div className="post-lister w-full gap-1 flex text-sm flex-col md:flex-row justify-center bg-background p-2 rounded-lg">
      <div className="small-content gap-1 flex flex-row">
        {/* Facebook Icon */}
        <div className="content-platform bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
          <Facebook />
        </div>

        {/* Image Icon */}
        <div className="content-type bg-background2 aspect-square w-[50px] flex justify-center items-center overflow-hidden rounded-lg">
          <Image />
        </div>

        {/* Image Preview */}
        <div className="content-preview bg-background2 aspect-square w-[50px] overflow-hidden rounded-lg">
          <img
            className="object-cover object-center w-full h-full rounded-lg"
            src="https://placehold.co/600x400?text=test\npost"
            alt=""
          />
        </div>

        {/* Release Date */}
        <div className="content-release-date text-center flex flex-col justify-center items-center px-1 bg-background2 rounded-lg">
          <p>11/11/2024</p>
          <p>12:30</p>
        </div>
      </div>

      <div className="content-title w-full px-1 bg-background2 rounded-lg">
        <p className="line-clamp-2">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Qui odio
          illum incidunt voluptatum. Iure dolores veritatis, modi sapiente nam
          ut, ex nesciunt reprehenderit voluptatum, consectetur minima quaerat
          magni! Aliquam, repellendus.
        </p>
      </div>

      <div className="pending-post-settings p-1 cursor-pointer flex justify-center items-center rounded-lg bg-background2">
        <Settings />
      </div>
    </div>
  );
}
