import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./page";
import Error from "./error";
import Dashboard from "./dashboard/page";
import Login from "./login/page";
import Signup from "./signup/page";
import Contact from "./contact/page";
import Subscription from "./subscription/page";
import Create from "./dashboard/creat/page";
import CreateFacebook from "./dashboard/creat/draft/facebook/page";
import CreateInstagram from "./dashboard/creat/draft/instagram/page";
import CreateTemplate from "./dashboard/template/page";
import DraftPage from "./dashboard/draft/page";
import InstagramDraft from "./dashboard/draft/instagram/page";
import FacebookDraft from "./dashboard/draft/facebook/page";
import Pending from "./dashboard/pending/page";
import FacebookPending from "./dashboard/pending/facebook/page";
import InstagramPending from "./dashboard/pending/instagram/page";
import FacebookEdit from "./dashboard/edit/facebook/page";
import InstagramEdit from "./dashboard/edit/instagram/page";
import Testtest from "./components/page/test.test";
import CreateDesign from "./dashboard/creat/design/page";
import CompaniesDetails from "./signup/details/Details";
import Privatepage from "./components/security/Privatepage";

function App() {
  return (
    <div className="bg-background text-text h-full">
      <Routes>
        {/* home page */}
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Testtest />} />

        {/* Private routes */}
        <Route element={<Privatepage />}>
          {/* dashboard section */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* creation section */}
          <Route path="/dashboard/create" element={<Create />} />
          <Route
            path="/dashboard/create/facebook"
            element={<CreateFacebook />}
          />
          <Route
            path="/dashboard/create/instagram"
            element={<CreateInstagram />}
          />
          <Route
            path="/dashboard/create/template/design"
            element={<CreateDesign />}
          />

          {/* get all templates */}
          <Route path="/dashboard/templates" element={<CreateTemplate />} />

          {/* pending post section */}
          <Route path="/dashboard/pending" element={<Pending />} />
          <Route
            path="/dashboard/pending/facebook"
            element={<FacebookPending />}
          />
          <Route
            path="/dashboard/pending/instagram"
            element={<InstagramPending />}
          />

          {/* draft post pages */}
          <Route path="/dashboard/draft" element={<DraftPage />} />
          <Route
            path="/dashboard/draft/instagram"
            element={<InstagramDraft />}
          />
          <Route path="/dashboard/draft/facebook" element={<FacebookDraft />} />

          {/* editing post (put request) */}
          <Route
            path="/dashboard/edit/facebook/:id"
            element={<FacebookEdit />}
          />
          <Route
            path="/dashboard/edit/instagram/:id"
            element={<InstagramEdit />}
          />
        </Route>

        {/* other routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/details" element={<CompaniesDetails />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/subscription" element={<Subscription />} />

        {/* catch-all error route */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
