import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useAddNewNoteMutation } from "./notesApiSlice";

const NewNoteForm = ({ users }) => {
  const [addNewNote, { isLoading, isSuccess, isError, error }] =
    useAddNewNoteMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setText("");
      setUser("");
      navigate("/dash/notes");
    }
  }, [isSuccess, navigate]);

  const canSave = [title, text, user].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();

    if (canSave) {
      await addNewNote({
        user,
        title,
        text,
      });
    }
  };

  const optionItems = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ));

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = title.length === 0 ? "form__input--incomplete" : "";
  const validTextClass = text.length === 0 ? "form__input--incomplete" : "";
  const validUserClass = user.length === 0 ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Note</h2>

          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
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

        {/* <label className="form__label" htmlFor="completed">
          Task Completed:
        </label>

        <input
          type="checkbox"
          id="completed"
          name="completed"
          value={completed}
          onChange={(e) => setCompleted((prev) => !prev)}
        /> */}
      </form>
    </>
  );

  return content;
};

export default NewNoteForm;
