import React, { useState } from "react";
import AddTheCustomer from "../components/AddTheCustomer";
import InventoryProducts from "../components/InventoryProducts";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Payroll from "./Payroll";
import AccountReceivable from "./AccountReceivable";
import AccountPayable from "./AccountPayable";
import Reports from "./Reports";
import Reviews from "./Reviews";
import CustomerDetails from "./CustomerDetails";
import InventoryItemAdd from "./InventoryItemAdd";
import { DeleteHistory } from "./DeleteHistory";

const SEARCH_TYPES = {
  inventory: "products",
  customers: "customers",
  "customer-details": "customers",
  "inventory-item": "products",
};

const Home = () => {
  const [activeComponent, setActiveComponent] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");

  const searchType = SEARCH_TYPES[activeComponent] || "products";
  const showSearch = ["inventory", "customers", "customer-details", "inventory-item"].includes(activeComponent);

  const renderContent = () => {
    switch (activeComponent) {
      case "inventory":
        return <InventoryProducts searchTerm={searchTerm} />;
      case "customers":
        return <AddTheCustomer searchTerm={searchTerm} />;
      case "customer-details":
        return <CustomerDetails embedded />;
      case "inventory-item":
        return <InventoryItemAdd embedded />;
      case "payroll":
        return <Payroll embedded />;
      case "account-receivable":
        return <AccountReceivable embedded />;
      case "account-payable":
        return <AccountPayable embedded />;
      case "reports":
        return <Reports embedded />;
      case "reviews":
        return <Reviews embedded />;
      case "delete-history":
        return <DeleteHistory embedded />;
      default:
        return <InventoryProducts searchTerm={searchTerm} />;
    }
  };

  return (
    <main className="flex h-screen max-w-[1600px] mx-auto overflow-hidden bg-gray-50">
      <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onSearch={setSearchTerm}
          searchType={searchType}
          showSearch={showSearch}
        />
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default Home;
