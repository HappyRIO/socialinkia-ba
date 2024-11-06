import { Router, Route } from "react-browser-router";
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
import CreateDesign from "./dashboard/creat/design/page";
import DraftPage from "./dashboard/draft/page";
import InstagramDraft from "./dashboard/draft/instagram/page";
import FacebookDraft from "./dashboard/draft/facebook/page";
import Pending from "./dashboard/pending/page";
import FacebookPending from "./dashboard/pending/facebook/page";
import InstagramPending from "./dashboard/pending/instagram/page";
import FacebookEdit from "./dashboard/edit/facebook/page";
import InstagramEdit from "./dashboard/edit/instagram/page";

function App() {
  return (
    <div className="bg-background text-text">
      <Router>
        {/* home page */}
        <Route index path="/" component={<Home />} />
        {/* dashboard section */}
        <Route path="/dashboard" component={<Dashboard />} />
        {/* creation section */}
        <Route path="/dashboard/create" component={<Create />} />
        <Route
          path="/dashbaord/create/facebook"
          component={<CreateFacebook />}
        />
        <Route
          path="/dashbaord/create/instagram"
          component={<CreateInstagram />}
        />
        <Route
          path="/dashbaord/create/template/design"
          component={<CreateDesign />}
        />
        {/* get all template */}
        <Route path="/dashbaord/templates" component={<CreateTemplate />} />
        {/* pending post section */}
        <Route path="/dashboard/pending" component={<Pending />} />

        <Route
          path="/dashboard/pending/facebook"
          component={<FacebookPending />}
        />
        <Route
          path="/dashboard/pending/instagram"
          component={<InstagramPending />}
        />
        {/* draft post pages */}
        <Route path="/dashboard/draft" component={<DraftPage />} />
        <Route
          path="/dashboard/draft/instagram"
          component={<InstagramDraft />}
        />
        <Route path="/dashboard/draft/facebook" component={<FacebookDraft />} />
        {/* editing post (put request) */}
        <Route
          path="/dashboard/edit/facebook/:id"
          component={<FacebookEdit />}
        />
        <Route
          path="/dashboard/edit/instagram/:id"
          component={<InstagramEdit />}
        />
        {/* others  */}
        <Route path="/login" component={<Login />} />
        <Route path="/signup" component={<Signup />} />
        <Route path="/contact" component={<Contact />} />
        <Route path="/subscription" component={<Subscription />} />
        <Route path="*" component={<Error />} />
      </Router>
    </div>
  );
}

export default App;
