import { Facebook, Instagram, Store } from "lucide-react";
import ResponsiveSidebar from "../components/navigation/ResponsiveSidebar";

export default function Dashboard() {
  return (
    <div className="w-full gap-3 flex flex-row justify-center items-center">
      <div className="sidebar w-fit">
        <ResponsiveSidebar pagename={"Dashboard"} />
      </div>
      <div className="main m-0 sm:ml-60 w-full p-2">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          <div className="top-view-zone border-[2px] border-text py-10 bg-background2 w-full rounded-lg flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center">
              <p className="text-4xl font-bold">13</p>
              <p>Published post</p>
            </div>
            <div className="others-zone py-3 flex flex-row gap-3 justify-center items-center">
              <div className="fbook flex flex-col justify-center items-center">
                <Facebook />
                <p>0</p>
              </div>
              <div className="insta flex flex-col justify-center items-center">
                <Instagram />
                <p>0</p>
              </div>
              <div className="google flex flex-col justify-center items-center">
                <Store />
                <p>0</p>
              </div>
            </div>
          </div>

          <div className="top-view-zone border-[2px] border-text py-10 bg-background2 w-full rounded-lg flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center">
              <p className="text-4xl font-bold">29</p>
              <p>pending November</p>
            </div>
            <div className="others-zone py-3 flex flex-row gap-3 justify-center items-center">
              <div className="fbook flex flex-col justify-center items-center">
                <Facebook />
                <p>3</p>
              </div>
              <div className="insta flex flex-col justify-center items-center">
                <Instagram />
                <p>7</p>
              </div>
              <div className="google flex flex-col justify-center items-center">
                <Store />
                <p>4</p>
              </div>
            </div>
          </div>
          <div className="top-view-zone border-[2px] border-text py-10 bg-background2 w-full rounded-lg flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center">
              <p className="text-4xl font-bold">19</p>
              <p>Pending December</p>
            </div>
            <div className="others-zone py-3 flex flex-row gap-3 justify-center items-center">
              <div className="fbook flex flex-col justify-center items-center">
                <Facebook />
                <p>2</p>
              </div>
              <div className="insta flex flex-col justify-center items-center">
                <Instagram />
                <p>7</p>
              </div>
              <div className="google flex flex-col justify-center items-center">
                <Store />
                <p>20</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-4 flex flex-col justify-center items-center gap-2">
          <div className="text-2xl text-center">
            <h1>Recent Post Analysis</h1>
          </div>

          <div className="w-full flex gap-2 flex-col md:flex-row justify-center">
            <div className="post w-full md:w-1/3">
              <img
                className="w-full aspect-square object-cover rounded-lg"
                src="https://placehold.co/600x400/#e7e2e1/#777270?text=Hello\nWorld"
                alt=""
              />
            </div>
            <div className="metrixs w-full md:w-2/3">
              <div className="total-likes flex flex-row gap-2">
                <div className="fbook flex flex-col justify-center items-center">
                  <Facebook />
                  <p>3</p>
                </div>
                <div className="insta flex flex-col justify-center items-center">
                  <Instagram />
                  <p>7</p>
                </div>
                <div className="google flex flex-col justify-center items-center">
                  <Store />
                  <p>4</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
