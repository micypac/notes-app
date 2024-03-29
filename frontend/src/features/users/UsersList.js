import { useGetUsersQuery } from "./usersApiSlice";
import UserRow from "./UserRow";
import { PulseLoader } from "react-spinners";

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000, // 60 seconds
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color="#FFF" />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;

    const tableContent =
      ids?.length &&
      ids.map((userId) => <UserRow key={userId} userId={userId} />);

    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th className="table__th user__username" scope="col">
              Username
            </th>
            <th className="table__th user__roles" scope="col">
              Roles
            </th>
            <th className="table__th user__edit" scope="col">
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

export default UsersList;
