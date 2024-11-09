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
import Pending from "./dashboard/pending/page";
import FacebookPending from "./dashboard/pending/facebook/page";
import InstagramPending from "./dashboard/pending/instagram/page";
import PrivateRoute from "./components/security/Privatepage";
import CreateDesign from "./dashboard/creat/design/page";
import Tester from "./components/page/backup.test";

function App() {
  return (
    <div className="w-full flex flex-col justify-center items-center bg-background text-text">
      <Routes>
        {/* Home and other public routes */}
        <Route index element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Tester />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/subscription" element={<Subscription />} />

        {/* Private routes (wrapped with PrivateRoute) */}
        <Route
          path="/dashboard"
          element={<PrivateRoute Component={Dashboard} />}
        />
        <Route
          path="/dashboard/create"
          element={<PrivateRoute Component={Create} />}
        />
        <Route
          path="/dashboard/create/design"
          element={<PrivateRoute Component={CreateDesign} />}
        />
        <Route
          path="/dashboard/create/facebook"
          element={<PrivateRoute Component={CreateFacebook} />}
        />
        <Route
          path="/dashboard/create/instagram"
          element={<PrivateRoute Component={CreateInstagram} />}
        />
        <Route
          path="/dashboard/templates"
          element={<PrivateRoute Component={CreateTemplate} />}
        />
        <Route
          path="/dashboard/pending"
          element={<PrivateRoute Component={Pending} />}
        />
        <Route
          path="/dashboard/pending/facebook"
          element={<PrivateRoute Component={FacebookPending} />}
        />
        <Route
          path="/dashboard/pending/instagram"
          element={<PrivateRoute Component={InstagramPending} />}
        />

        {/* Catch-all error route */}
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
