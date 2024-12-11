import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page";
import Error from "./error";
import Dashboard from "./dashboard/page";
import Login from "./login/page";
import Signup from "./signup/page";
import Contact from "./contact/page";
import TemplatePage from "./dashboard/template/page";
import Pending from "./dashboard/posts/page";
import PrivateRoute from "./components/security/Privatepage";
import CreateDesign from "./dashboard/creat/design/page";
import Tester from "./components/page/backup.test";
import CompaniesDetails from "./signup/details/Details";
import Submanagement from "./dashboard/subscriptionmanagment/Submanagement";
import Profile from "./dashboard/profile/Profile";
import CreatTemplate from "./dashboard/creat/CreatTemplate";
import PostCreation from "./dashboard/creat/post/PostCreation";
import Editpost from "./dashboard/edit/Editpost";
import Aboutus from "./components/page/about/Aboutus";
import Subscrptionmain from "./signup/subscription/sub";
import SignupMain from "./signup/subscription/signup/signup";
import BusinessForm from "./signup/subscription/signup/companies/Details";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/test", element: <Tester /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signup/details", element: <CompaniesDetails /> },
  { path: "/contact", element: <Contact /> },
  { path: "/about", element: <Aboutus /> },
  { path: "/subscription", element: <Subscrptionmain /> },
  { path: "/subscription/signup", element: <SignupMain /> },
  {
    path: "/subscription/signup/details",
    element: <PrivateRoute Component={BusinessForm} />,
    // element: <BusinessForm />,
  },

  // Direct routes with PrivateRoute applied to each protected route
  { path: "/dashboard", element: <PrivateRoute Component={Dashboard} /> },
  {
    path: "/dashboard/profile",
    element: <PrivateRoute Component={Profile} />,
    // element: <Profile />,
  },
  {
    path: "/dashboard/subscription",
    element: <PrivateRoute Component={Submanagement} />,
  },
  {
    path: "/dashboard/create",
    element: <PrivateRoute Component={CreatTemplate} />,
  },
  {
    path: "/dashboard/create/post",
    element: <PrivateRoute Component={PostCreation} />,
  },
  { path: "/dashboard/posts", element: <PrivateRoute Component={Pending} /> },
  {
    path: "/dashboard/posts/edit/:postId",
    element: <PrivateRoute Component={Editpost} />,
  },
  // {
  //   path: "/dashboard/create/design",
  //   element: <PrivateRoute Component={CreateDesign} />,
  // },
  {
    path: "/dashboard/create/design",
    element: <CreateDesign />,
  },
  {
    path: "/dashboard/templates",
    element: <PrivateRoute Component={TemplatePage} />,
  },

  { path: "*", element: <Error /> },
]);

function App() {
  return (
    <div className="w-full bg-background text-text text-md sm:text-xl overflow-hidden flex flex-col justify-center items-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
