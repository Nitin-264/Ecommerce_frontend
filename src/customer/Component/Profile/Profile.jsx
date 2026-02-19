import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../State/Auth/Action";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((store) => store.auth);
  const jwt = localStorage.getItem("jwt");
  const isAdmin = (user?.role || "").toLowerCase() === "admin";

  useEffect(() => {
    if (!user && jwt) {
      dispatch(getUser(jwt));
    }
  }, [dispatch, user, jwt]);

  if (!jwt) {
    return (
      <div className="px-5 lg:px-20 py-10 text-left">
        Please sign in to view your profile.
      </div>
    );
  }

  if (isLoading && !user) {
    return (
      <div className="px-5 lg:px-20 py-10 text-left">
        Loading profile...
      </div>
    );
  }

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "-";

  return (
    <div className="px-5 lg:px-20 py-10">
      <div className="max-w-2xl border rounded-md shadow-sm p-6 text-left">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
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
            <p className="font-medium">{user?.role || "USER"}</p>
          </div>
          {isAdmin && (
            <div className="pt-2">
              <Button
                variant="contained"
                sx={{ bgcolor: "black" }}
                onClick={() => navigate("/admin")}
              >
                Go To Admin Portal
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
