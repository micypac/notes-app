import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const NewNote = () => {
  const users = useSelector(selectAllUsers);

  // since users query can only be accessed by logged in user using token
  if (!users?.length) {
    return <p>Not Currently Available</p>;
  }

  const content = <NewNoteForm users={users} />;

  return content;
};

export default NewNote;
