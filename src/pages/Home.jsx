import React, { useState } from "react";
import AddTheCustomer from "../components/AddTheCustomer";
import InventoryProducts from "../components/InventoryProducts";
import Sidebar from "../components/Sidebar"; 
import Topbar from "../components/Topbar";

const Home = () => {
    const [activeComponent, setActiveComponent] = useState("customers");

    return (
        <main className="flex h-screen">
            {/* Sidebar */}
            <Sidebar setActiveComponent={setActiveComponent} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center">
                <Topbar/>
                <h1 className="text-2xl font-bold uppercase mb-1">Plastic Factory Management</h1>
                
                {/* Render Active Component */}
                {activeComponent === "customers" ? <AddTheCustomer /> : <InventoryProducts />}
            </div>
        </main>
    );
};

export default Home;
