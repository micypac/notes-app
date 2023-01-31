import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import store from "../../app/store";
import usersApiSlice from "../users/usersApiSlice";
import notesApiSlice from "../notes/notesApiSlice";

const PreFetch = () => {
  useEffect(() => {
    console.log("subscribing...");

    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate()); // this is the manual subscription
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate()); // this is the manual subscription

    // cleanup.. unsubscribe once we leave the protected pages.
    return () => {
      console.log("unsubscribing...");

      notes.unsubscribe();
      users.unsubscribe();
    };
  });

  return <Outlet />;
};

export default PreFetch;
