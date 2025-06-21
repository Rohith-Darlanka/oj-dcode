import {  createBrowserRouter,  RouterProvider,} from 'react-router-dom';
import Home from './pages/Home';
import Problemset from './pages/Problemset';
import Help from './pages/Help';
import Enter from './pages/Enter';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AuthRoute from './components/AuthRoute';
import AddProblem from './pages/admin/AddProblem';
import ProblemDetail from './pages/ProblemDetail';
import AddTestcase from "./pages/admin/AddTestcase";
import AddHiddenTestcase from "./pages/admin/AddHiddenTestcase";
import UpdateProblemList from './components/UpdateProblemList';
import UpdateProblemDetail from './components/UpdateProblemDetail';
import DeleteProblemPage from "./pages/admin/DeleteProblemPage";
import DeleteTestcasePage from "./pages/admin/DeleteTestcasePage";
import DeleteHiddenTestcasePage from "./pages/admin/DeleteHiddenTestcasePage";
import Footer from './components/footer';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/problemset',
    element: (
      <>
        <Navbar />
        <Problemset />
      </>
    ),
  },
  {
    path: '/help',
    element: (
      <>
        <Navbar />
        <Help />
      </>
    ),
  },
  {
    path: '/enter',
    element: <Enter />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/profile',
    element: (
      <AuthRoute>
        <>
          <Navbar />
          <Profile />
        </>
      </AuthRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <AuthRoute role="admin">
        <>
          <Navbar />
          <Admin />
        </>
      </AuthRoute>
    ),
  },
    {
   path: '/admin/add-problem',
  element: (
    <AuthRoute role="admin">
      <>
        <Navbar />
        <AddProblem />
      </>
    </AuthRoute>
  ),
  },
  {
  path: '/problemset/:problem_id',
  element: (
    <>
      <Navbar />
      <ProblemDetail />
      <Footer />
    </>
  ),
},
{
  path: '/admin/add-testcase',
  element: (
    <AuthRoute role="admin">
      <>
        <Navbar />
        <AddTestcase />
      </>
    </AuthRoute>
  ),
},
{
  path: '/admin/add-hidden-testcase',
  element: (
    <AuthRoute role="admin">
      <>
        <Navbar />
        <AddHiddenTestcase />
      </>
    </AuthRoute>
  ),
},
 {
    path: '/admin/update-problem',
    element: (
      <AuthRoute role="admin">
        <>
          <Navbar />
          <UpdateProblemList />
          <div>Update Problem List View</div>
        </>
      </AuthRoute>
    ),
  },
  {
    path: '/admin/update-problem/:problemId',
    element: (
      <AuthRoute role="admin">
        <>
          <Navbar />
          <UpdateProblemDetail />
          <div>Update Problem Detail View</div>
        </>
      </AuthRoute>
    ),
  },
  {
    path: '/admin/add-testcase/:problemId',
    element: (
      <AuthRoute role="admin">
        <>
          <Navbar />
          <AddTestcase />
        </>
      </AuthRoute>
    ),
  },
  {
    path: '/admin/add-hidden-testcase/:problemId',
    element: (
      <AuthRoute role="admin">
        <>
          <Navbar />
          <AddHiddenTestcase />
        </>
      </AuthRoute>
    ),
  },
   {
    path: '/admin/delete-problem',
    element: <DeleteProblemPage />,
  },
   {
    path: '/admin/delete-testcase',
    element: <DeleteTestcasePage />,
  },
  {
    path: '/admin/delete-hidden-testcase',
    element: <DeleteHiddenTestcasePage />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;