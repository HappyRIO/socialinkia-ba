import ResponsiveSidebar from "../../../components/navigation/ResponsiveSidebar";

export default function InstagramPending() {
  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"Instagram posts"} />
      </div>
      <div className="contentzone ml-0 sm:ml-64 w-full">
        <h1>pending post</h1>
      </div>
    </div>
  );
}
