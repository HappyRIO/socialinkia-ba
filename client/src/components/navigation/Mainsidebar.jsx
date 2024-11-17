import { NavLink } from "react-router-dom";
import {
  Mailbox,
  LayoutDashboard,
  LayoutPanelTop,
  List,
  ListX,
  LogOut,
  Pencil,
  Podcast,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function Mainsidebar({ menufunction, menustate, pagename }) {
  const [UserData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/api/auth/user/details`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json(); // Parse the response as JSON
          setUserData(data.user.companyDetails);
          console.log(data); // Log the parsed data
        } else {
          console.error("Failed to fetch user data:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  return (
    <div className="h-screen bg-background w-fit fixed left-0 top-0 shadow-xl">
      <div className="flex flex-col h-full p-3 w-60">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2>{pagename}</h2>
            <div className="sm:hidden">
              <button onClick={menufunction}>
                {menustate ? <ListX /> : <List />}
              </button>
            </div>
          </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              <li className="rounded-sm">
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  <LayoutDashboard />
                  <span>dashboard</span>
                </NavLink>
              </li>
              <li className="rounded-sm">
                <NavLink
                  to="/dashboard/create"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  <Pencil />
                  <span>create</span>
                </NavLink>
              </li>
              <li className="rounded-sm">
                <NavLink
                  to="/dashboard/templates"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  <LayoutPanelTop />
                  <span>template</span>
                </NavLink>
              </li>
              <li className="rounded-sm">
                <NavLink
                  to="/dashboard/posts"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  <Mailbox />
                  <span>posts</span>
                </NavLink>
              </li>
              <li className="rounded-sm">
                <NavLink
                  to="/dashboard/subscription"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  <Podcast />
                  <span>subscription</span>
                </NavLink>
              </li>
              <li className="rounded-sm">
                <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  <UserRound />
                  <span>profile</span>
                </NavLink>
              </li>
              <li className="rounded-sm">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center p-2 space-x-3 rounded-md ${
                      isActive ? "bg-accent" : ""
                    }`
                  }
                >
                  <LogOut />
                  <span>Logout</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex items-center p-2 mt-12 space-x-4 justify-self-end">
          <img
            src="https://placehold.co/400x400"
            alt="profile image"
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <h2 className="text-md">{UserData ? UserData.UserName : ""}</h2>
            <span className="flex items-center space-x-1 text-sm hover:underline text-gray-500">
              <NavLink to="/dashboard/profile">View profile</NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
