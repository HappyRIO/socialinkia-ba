import { List, ListX } from "lucide-react";
import Mainsidebar from "./Mainsidebar";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function ResponsiveSidebar({ pagename }) {
  const [menuOpen, setOpenMenu] = useState(false);
  function handlemenuopen() {
    setOpenMenu(!menuOpen);
  }
  return (
    <div className="w-fit">
      <div className="sidebar w-fit hidden sm:block">
        <Mainsidebar
          pagename={pagename}
          menufunction={handlemenuopen}
          menustate={menuOpen}
        />
      </div>
      <div className="navbarmobile m-0 sm:hidden fixed top-0 left-0 w-full justify-center items-center">
        <div className="menubutton fixed right-4 top-4">
          <button onClick={handlemenuopen}>
            {menuOpen ? <ListX /> : <List />}
          </button>
        </div>
        {menuOpen && (
          <div id="mobilemenubar" className="w-fit fixed left-0 top-0">
            <Mainsidebar
              pagename={pagename}
              menufunction={handlemenuopen}
              menustate={menuOpen}
            />
          </div>
        )}
      </div>
    </div>
  );
}
