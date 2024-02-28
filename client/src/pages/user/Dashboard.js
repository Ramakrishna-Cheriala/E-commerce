import React from "react";
import UserMenu from "../../components/Layout/UserMenu";

const Dashboard = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-72">
          <UserMenu />
        </div>
        <div className="flex-1 p-5">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
