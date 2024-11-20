import { NavLink } from "react-router-dom";
import translate from "translate";
import { useEffect, useState } from "react";
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

// eslint-disable-next-line react/prop-types
export default function Mainsidebar({ menufunction, menustate, pagename }) {
  const [UserData, setUserData] = useState({});
  const [language, setLanguage] = useState("en"); // Default to English
  const supportedLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "ig", name: "Igbo" },
    { code: "zh", name: "中文" },
    { code: "ja", name: "日本語" },
    { code: "ru", name: "Русский" },
    { code: "pt", name: "Português" },
    { code: "ar", name: "العربية" },
    { code: "it", name: "Italiano" },
    { code: "ko", name: "한국어" },
    { code: "hi", name: "हिन्दी" },
    { code: "tr", name: "Türkçe" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "pl", name: "Polski" },
    { code: "nl", name: "Nederlands" },
    { code: "sv", name: "Svenska" },
    { code: "da", name: "Dansk" },
    { code: "fi", name: "Suomi" },
    { code: "no", name: "Norsk" },
    { code: "th", name: "ไทย" },
    { code: "he", name: "עברית" },
    { code: "cs", name: "Čeština" },
    { code: "hu", name: "Magyar" },
    { code: "ro", name: "Română" },
    { code: "sk", name: "Slovenčina" },
    { code: "sl", name: "Slovenščina" },
    { code: "bg", name: "Български" },
    { code: "uk", name: "Українська" },
    { code: "lt", name: "Lietuvių" },
    { code: "lv", name: "Latviešu" },
    { code: "et", name: "Eesti" },
    { code: "is", name: "Íslenska" },
    { code: "mt", name: "Malti" },
    { code: "ms", name: "Bahasa Melayu" },
    { code: "sw", name: "Kiswahili" },
    { code: "tl", name: "Tagalog" },
    { code: "bn", name: "বাংলা" },
    { code: "pa", name: "ਪੰਜਾਬੀ" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "ml", name: "മലയാളം" },
    { code: "or", name: "ଓଡ଼ିଆ" },
    { code: "si", name: "සිංහල" },
    { code: "km", name: "ខ្មែរ" },
    { code: "my", name: "မြန်မာ" },
    { code: "ne", name: "नेपाली" },
    { code: "am", name: "አማርኛ" },
    { code: "sn", name: "Shona" },
    { code: "zu", name: "Zulu" },
  ];

  useEffect(() => {
    // Load language from localStorage if available
    const storedLanguage = localStorage.getItem("language");
    if (
      storedLanguage &&
      supportedLanguages.find((lang) => lang.code === storedLanguage)
    ) {
      setLanguage(storedLanguage);
      translatePage(storedLanguage); // Automatically translate the page
    } else {
      // Detect user's default language using navigator or API
      const userLang = navigator.language.split("-")[0]; // Get browser language
      if (supportedLanguages.find((lang) => lang.code === userLang)) {
        setLanguage(userLang);
        translatePage(userLang); // Automatically translate the page
      }
    }

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

  const translatePage = async (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang); // Save language to localStorage
    translate.engine = "google"; // Use Google Translate

    const elements = document.querySelectorAll("body *"); // Get all elements in the body

    for (let element of elements) {
      // Check if element has no children and innerText is defined and not empty
      if (
        element.children.length === 0 &&
        element.innerText &&
        element.innerText.trim() !== ""
      ) {
        try {
          const translatedText = await translate(element.innerText, lang);
          element.innerText = translatedText;
        } catch (error) {
          console.error("Translation error:", error);
        }
      }
    }
  };

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
            src={UserData ? UserData.logo : "https://placehold.co/400x400"}
            alt="profile image"
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <span className="flex flex-col items-center space-x-1 text-sm hover:underline text-gray-500">
              <h2 className="text-md">{UserData ? UserData.userName : ""}</h2>
              <NavLink to="/dashboard/profile">View profile</NavLink>
            </span>
          </div>
        </div>
        <div className="lang-selector flex flex-col gap-2">
          <label htmlFor="language-select" className="text-sm">
            Choose a language:{" "}
          </label>
          <select
            id="language-select"
            className="text-sm p-1 rounded-lg"
            value={language}
            onChange={(e) => translatePage(e.target.value)}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
