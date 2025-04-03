import { useState } from "react";
import { LayoutDashboard, Users, ChevronDown } from "lucide-react"; 
import navIcon from "../assets/img/navIcon.png";

const Sidebar = ({ setActiveComponent }) => {
  const [selected, setSelected] = useState("Inventory");
  const [isExpanded, setIsExpanded] = useState(false); 

  const menuItems = [
    { name: "Inventory", icon: <LayoutDashboard size={20} />, component: "inventory" },
    { name: "Customer", icon: <Users size={20} />, component: "customers" },
  ];

  return (
    <div className="min-h-screen w-[250px] h-[960px] p-4 border-0 border-r-[1px] border-[#17BCBE]">
      {/* Logo Section */}
      <div className="flex items-center gap-2.5 mb-6">
        <img className="h-8 w-8" src={navIcon} alt="Logo" />
        <span className="text-2xl font-bold text-[#108587] leading-[36px]">
          Stockease
        </span>
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-2 mt-[3rem]">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`flex items-center justify-between p-[8px] rounded-lg cursor-pointer w-full
              ${selected === item.name ? "bg-[#E8F8F9] text-[#108587] border-l-[3px] border-[#17BCBE]" : "text-[#17BCBE] hover:bg-gray-200"}
            `}
            onClick={() => {
              setSelected(item.name);
              setActiveComponent(item.component); 
              setIsExpanded(!isExpanded); 
            }}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-lg font-medium">{item.name}</span>
            </div>
            {selected === item.name && isExpanded && <ChevronDown size={20} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
