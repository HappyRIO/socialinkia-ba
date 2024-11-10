import ResponsiveSidebar from "../../../components/navigation/ResponsiveSidebar";

export default function PostCreation() {
  return (
    <div className="w-full flex flex-row justify-center items-center">
      <div className="navbarzone w-fit">
        <ResponsiveSidebar pagename={"Creat post"} />
      </div>
      <div className="contentzone ml-0 sm:ml-64 w-full">
        <h1>Submanagement</h1>
      </div>
    </div>
  );
}
