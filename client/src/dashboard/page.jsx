import ResponsiveSidebar from "../components/navigation/ResponsiveSidebar";

export default function Dashboard() {


  return (
    <div className="w-full gap-3 flex flex-row justify-center items-center">
      <div className="sidebar w-fit">
        <ResponsiveSidebar pagename={"Dashboard"} />
      </div>
      <div className="main m-0 sm:ml-60 w-full">
       
      </div>
    </div>
  );
}
