import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import useAuth from "../../hooks/useAuth";

const EditNoteForm = ({ note, users }) => {
  const navigate = useNavigate();

  // custom hook to authenticate JWT credential
  const { isAdmin, isManager } = useAuth();

  // RTK Query endpoint hooks
  const [updateNote, { isLoading, isSuccess, isError, error }] =
    useUpdateNoteMutation();

  const [
    deleteNote,
    { isSuccess: isDelSuccess, isError: isDelError, error: delError },
  ] = useDeleteNoteMutation();

  // useStates
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [user, setUser] = useState(note.user._id);
  const [completed, setCompleted] = useState(note.completed);

  // useEffect
  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setText("");
      setUser("");
      navigate("/dash/notes");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  // flags
  const canSave = [title, text, user].every(Boolean) && !isLoading;

  // event handlers
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

  // JSX HTML elements
  const optionItems = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ));

  const created = new Date(note.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const updated = new Date(note.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

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

  const errContent = (error?.data?.message || delError?.data?.message) ?? "";

  // class attribute values
  const errClass = isError || isDelError ? "errmsg" : "offscreen";
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
          className={`form__input form__input--text ${validTextClass}`}
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="form__row">
          <div className="form__divider">
            <label className="form__label" htmlFor="completed">
              Task Completed:
            </label>

            <input
              type="checkbox"
              className="form__checkbox"
              id="completed"
              name="completed"
              checked={completed}
              onChange={(e) => setCompleted((prev) => !prev)}
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
          </div>

          <div className="form__divider">
            <p className="form__created">
              Created: <br />
              {created}
            </p>
            <p className="form__updated">
              Updated: <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditNoteForm;
