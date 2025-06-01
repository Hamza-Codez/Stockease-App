import React, { useState } from "react";
import AddTheCustomer from "../components/AddTheCustomer";
import InventoryProducts from "../components/InventoryProducts";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main className="flex h-screen max-w-[1600px] mx-auto">
      <Sidebar setActiveComponent={setActiveComponent} />

      <div className="flex-1 flex flex-col items-center">
        <Topbar
          onSearch={(searchTerm) => setSearchTerm(searchTerm)}
          searchType={activeComponent === "inventory" ? "products" : "customers"}
        />

        {activeComponent === "inventory" ? (
          <InventoryProducts searchTerm={searchTerm} />
        ) : (
          <AddTheCustomer searchTerm={searchTerm} />
        )}
      </div>
    </main>
  );
};

export default Home;
