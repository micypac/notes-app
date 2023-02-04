import { useGetNotesQuery } from "./notesApiSlice";
import Noterow from "./NoteRow";
import useAuth from "../../hooks/useAuth";

const NotesList = () => {
  const { isAdmin, isManager, username } = useAuth();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = notes;

    let filteredIds;

    if (isAdmin || isManager) {
      filteredIds = [...ids];
    } else {
      // restrict to only the notes assigned to user if role is "Employee"
      filteredIds = ids.filter(
        (noteId) => entities[noteId].username === username
      );
    }

    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <Noterow key={noteId} noteId={noteId} />);

    content = (
      <table className="table table--notes">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th note_status">
              Status
            </th>
            <th scope="col" className="table__th note_created">
              Created
            </th>
            <th scope="col" className="table__th note_updated">
              Updated
            </th>
            <th scope="col" className="table__th note_title">
              Title
            </th>
            <th scope="col" className="table__th note_owner">
              Owner
            </th>
            <th scope="col" className="table__th note_edit">
              Edit
            </th>
          </tr>
        </thead>

        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
};

export default NotesList;
