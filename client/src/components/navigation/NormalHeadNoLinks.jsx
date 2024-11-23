import { Link } from "react-router-dom";

export default function NormalHeadNoLinks() {
  return (
    <div className="w-full bg-background">
      <Link to={"/dashboard"}>
        <img
          className="w-full bg-black max-w-[300px]"
          src="/images/nav.png"
          alt=""
        />
      </Link>
    </div>
  );
}
