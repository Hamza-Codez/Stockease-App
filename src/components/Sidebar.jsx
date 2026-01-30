import { useState, useEffect } from "react";
import navIcon from "../assets/img/navIcon.png";
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  ChevronRight,
  UserCog,
  Wallet,
  BookOpen,
  Receipt,
  FileText,
  BarChart2,
  ClipboardList,
  PackagePlus,
  Trash2,
} from "lucide-react";

const menuItems = [
  {
    name: "Inventory",
    icon: <LayoutDashboard size={20} />,
    component: "inventory",
    subItems: [{ name: "Inventory Item", icon: <PackagePlus size={20} />, component: "inventory-item" }],
  },
  {
    name: "Customer",
    icon: <Users size={20} />,
    component: "customers",
    subItems: [{ name: "Customer Details", icon: <Users size={20} />, component: "customer-details" }],
  },
  {
    name: "Employees",
    icon: <UserCog size={20} />,
    subItems: [{ name: "Payroll", icon: <Wallet size={20} />, component: "payroll" }],
  },
  {
    name: "Accounting",
    icon: <BookOpen size={20} />,
    subItems: [
      { name: "Account Receivable", icon: <Receipt size={20} />, component: "account-receivable" },
      { name: "Account Payable", icon: <FileText size={20} />, component: "account-payable" },
    ],
  },
  { name: "Reports", icon: <BarChart2 size={20} />, component: "reports" },
  { name: "Reviews", icon: <ClipboardList size={20} />, component: "reviews" },
  { name: "Delete History", icon: <Trash2 size={20} />, component: "delete-history" },
];

function findSelectedName(activeComponent) {
  for (const item of menuItems) {
    if (item.component === activeComponent) return item.name;
    if (item.subItems) {
      for (const sub of item.subItems) {
        if (sub.component === activeComponent) return sub.name;
      }
    }
  }
  return "Inventory";
}

const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const [selected, setSelected] = useState(() => findSelectedName(activeComponent));
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    setSelected(findSelectedName(activeComponent));
  }, [activeComponent]);

  const toggleExpand = (itemName) => {
    setExpandedItems((prev) => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleItemClick = (item, isSubItem = false) => {
    if (!isSubItem && item.subItems) {
      toggleExpand(item.name);
      if (!expandedItems[item.name] && item.component) {
        setActiveComponent(item.component);
      }
    } else {
      setSelected(item.name);
      if (item.component) setActiveComponent(item.component);
    }
  };

  return (
    <aside className="w-full max-w-[250px] min-h-screen shrink-0 p-4 border-0 border-r border-[#17BCBE] bg-white lg:min-h-[100vh]">
      <div className="flex items-center gap-2.5 mb-6">
        <img className="h-8 w-8" src={navIcon} alt="Logo" />
        <span className="text-xl font-bold text-[#108587] leading-tight lg:text-2xl">Stockease</span>
      </div>

      <ul className="space-y-2 mt-6">
        {menuItems.map((item) => (
          <li key={item.name}>
            <div
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer w-full transition-colors
                ${selected === item.name ? "bg-[#E8F8F9] text-[#108587] border-l-[3px] border-[#17BCBE]" : "text-[#17BCBE] hover:bg-[#E8F8F9] hover:text-[#108587]"}`}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon}
                <span className="text-sm font-medium truncate lg:text-base">{item.name}</span>
              </div>
              {item.subItems && (expandedItems[item.name] ? <ChevronDown size={20} className="shrink-0" /> : <ChevronRight size={20} className="shrink-0" />)}
            </div>

            {item.subItems && expandedItems[item.name] && (
              <ul className="ml-6 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <li
                    key={subItem.name}
                    className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors
                      ${selected === subItem.name ? "bg-[#E8F8F9] text-[#108587] border-l-[3px] border-[#17BCBE]" : "text-[#17BCBE] hover:bg-[#E8F8F9] hover:text-[#108587]"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(subItem, true);
                    }}
                  >
                    <span className="text-sm font-medium truncate lg:text-base">{subItem.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
