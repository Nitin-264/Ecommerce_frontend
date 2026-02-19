import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, logout } from "../../State/Auth/Action";

const AdminAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((store) => store.auth);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (!user && jwt) {
      dispatch(getUser(jwt));
    }
  }, [dispatch, user, jwt]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (!jwt) {
    return <div className="p-6">Please login to access your account.</div>;
  }

  if (isLoading && !user) {
    return <div className="p-6">Loading admin details...</div>;
  }

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "-";

  return (
    <div className="p-6">
      <div className="max-w-2xl border rounded-md shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Admin Account</h1>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.email || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">
              {user?.mobile || user?.phoneNumber || user?.phone || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">{user?.role || "ADMIN"}</p>
          </div>
          <div className="pt-2">
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
