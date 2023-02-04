import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";

const EditNoteForm = ({ note, users }) => {
  const navigate = useNavigate();

  const { isAdmin, isManager } = useAuth();

  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteNoteMutation();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [user, setUser] = useState(note.user);
  const [completed, setCompleted] = useState(note.completed);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUser("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const canSave = [title, text, user].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    if (canSave) {
      await updateNote({
        id: note.id,
        user,
        title,
        text,
        completed,
      });
    }
  };

  const onDeleteNoteClicked = async () => {
    await deleteNote({
      id: note.id,
    });
  };

  const optionItems = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ));

  let deleteButton = null;
  if (isAdmin || isManager) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteNoteClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const errContent = (error?.data?.message || delError?.data?.message) ?? "";
  const validTitleClass = title.length === 0 ? "form__input--incomplete" : "";
  const validTextClass = text.length === 0 ? "form__input--incomplete" : "";
  const validUserClass = user.length === 0 ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note</h2>

          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
              onClick={onSaveNoteClicked}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>

            {deleteButton}
          </div>
        </div>

        <label className="form__label" htmlFor="title">
          Title:
        </label>

        <input
          type="text"
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="form__label" htmlFor="text">
          Description:
        </label>

        <textarea
          id="text"
          className={`form__input ${validTextClass}`}
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label className="form__label" htmlFor="user">
          Assigned User:
        </label>

        <select
          id="user"
          className={`form__select ${validUserClass}`}
          name="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        >
          <option value="" disabled>
            Select User...
          </option>
          {optionItems}
        </select>

        <label className="form__label" htmlFor="completed">
          Task Completed:
        </label>

        <input
          type="checkbox"
          className="form__checkbox"
          id="completed"
          name="completed"
          value={completed}
          onChange={(e) => setCompleted((prev) => !prev)}
        />
      </form>
    </>
  );

  return content;
};

export default EditNoteForm;
