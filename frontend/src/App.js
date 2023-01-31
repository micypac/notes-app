import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashboardLayout from "./components/DashboardLayout";
import Welcome from "./features/auth/Welcome";
import PreFetch from "./features/auth/PreFetch";
import UsersList from "./features/users/UsersList";
import NotesList from "./features/notes/NotesList";
import NewUserForm from "./features/users/NewUserForm";
import EditUser from "./features/users/EditUser";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<PreFetch />}>
          <Route path="dash" element={<DashboardLayout />}>
            <Route index element={<Welcome />} />

            <Route path="notes">
              <Route index element={<NotesList />} />
            </Route>

            <Route path="users">
              <Route index element={<UsersList />} />
              <Route path=":id" element={<EditUser />} />
              <Route path="new" element={<NewUserForm />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
