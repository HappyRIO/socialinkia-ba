import "../css/loader.css";

export default function Loader() {
  return (
    <div className="w-screen bg-accent h-[100vh] absolute left-0 top-0 z-[999999] flex justify-center items-center">
      <div className="loader"></div>
    </div>
  );
}
