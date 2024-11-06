import React from "react";
import Link from "next/link";

export default function DashboardNavigation({}) {
  return (
    <div className="social-bar flex w-full justify-between items-center flex-row">
      <div className="navigation w-full flex flex-row justify-center items-center">
        <Link href={"/dashboard/feed/instagram"}>instagram</Link>
        <Link href={"/dashboard/feed/facebook"}>facebook</Link>
        <Link href={"/dashboard/design"}>design</Link>
      </div>
    </div>
  );
}
