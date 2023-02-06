import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import { PulseLoader } from "react-spinners";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USER_REGEX = /^\/dash\/user(\/)?$/;

const DashboardHeader = () => {
  const { isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  let dashClass = null;

  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USER_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className="icon-button"
        title="New Note"
        onClick={() => navigate("/dash/notes/new")}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let newUserButton = null;
  if (USER_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={() => navigate("/dash/users/new")}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (pathname.includes("/dash") && !USER_REGEX.test(pathname)) {
      userButton = (
        <button
          className="icon-button"
          title="Users"
          onClick={() => navigate("/dash/users")}
        >
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let noteButton = null;
  if (pathname.includes("/dash") && !NOTES_REGEX.test(pathname)) {
    noteButton = (
      <button
        className="icon-button"
        title="Notes"
        onClick={() => navigate("/dash/notes")}
      >
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errmsg" : "offscreen";

  let buttonsContent;

  if (isLoading) {
    buttonsContent = <PulseLoader color="#FFF" />;
  } else {
    buttonsContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {noteButton}
        {userButton}
        {logoutButton}
      </>
    );
  }

  return (
    <>
      <p className={errClass}>{error?.data?.message}</p>
      <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash/notes">
            <h1 className="dash-header__title">OTTO Tech Notes</h1>
          </Link>

          <nav className="dash-header__nav">{buttonsContent}</nav>
        </div>
      </header>
    </>
  );
};

export default DashboardHeader;
