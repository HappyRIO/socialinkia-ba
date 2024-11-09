import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./page";
import Error from "./error";
import Dashboard from "./dashboard/page";
import Login from "./login/page";
import Signup from "./signup/page";
import Contact from "./contact/page";
import Subscription from "./subscription/page";
import Create from "./dashboard/creat/page";
import TemplatePage from "./dashboard/template/page";
import Pending from "./dashboard/pending/page";
import FacebookPending from "./dashboard/pending/facebook/page";
import PrivateRoute from "./components/security/Privatepage";
import CreateDesign from "./dashboard/creat/design/page";
import Tester from "./components/page/backup.test";
import CompaniesDetails from "./signup/details/Details";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/test", element: <Tester /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/details", element: <CompaniesDetails /> },
  { path: "/contact", element: <Contact /> },
  { path: "/subscription", element: <Subscription /> },

  // Direct routes with PrivateRoute applied to each protected route
  { path: "/dashboard", element: <PrivateRoute Component={Dashboard} /> },
  { path: "/dashboard/create", element: <PrivateRoute Component={Create} /> },
  {
    path: "/dashboard/create/design",
    element: <PrivateRoute Component={CreateDesign} />,
  },
  {
    path: "/dashboard/templates",
    element: <PrivateRoute Component={TemplatePage} />,
  },
  { path: "/dashboard/pending", element: <PrivateRoute Component={Pending} /> },
  {
    path: "/dashboard/pending/facebook",
    element: <PrivateRoute Component={FacebookPending} />,
  },

  { path: "*", element: <Error /> },
]);

function App() {
  return (
    <div className="w-full flex flex-col justify-center items-center bg-background text-text">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
