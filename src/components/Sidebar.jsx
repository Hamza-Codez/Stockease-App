import { useState } from "react";
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
  ClipboardList
} from "lucide-react"; 

const Sidebar = ({ setActiveComponent }) => {
  const [selected, setSelected] = useState("Inventory");
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (itemName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const menuItems = [
    { 
      name: "Inventory", 
      icon: <LayoutDashboard size={20} />, 
      component: "inventory" 
    },
    { 
      name: "Customer", 
      icon: <Users size={20} />, 
      component: "customers" 
    },
    { 
      name: "Employees", 
      icon: <UserCog size={20} />,
      subItems: [
        { 
          name: "Payroll", 
          icon: <Wallet size={20} />, 
          component: "payroll" 
        },
      ]
    },
    { 
      name: "Accounting", 
      icon: <BookOpen size={20} />,
      subItems: [
        { 
          name: "Account Receivable", 
          icon: <Receipt size={20} />, 
          component: "account-receivable" 
        },
        { 
          name: "Account Payable", 
          icon: <FileText size={20} />, 
          component: "account-payable" 
        }
      ]
    },
    { 
      name: "Reports", 
      icon: <BarChart2 size={20} />,
      component: "reports"  
    },
    { 
      name: "Reviews", 
      icon: <ClipboardList size={20} />, 
      component: "reviews" 
    }
  ];

  const handleItemClick = (item, isSubItem = false) => {
    if (!isSubItem && item.subItems) {
      toggleExpand(item.name);
      if (!expandedItems[item.name]) {
        setSelected(item.name);
        setActiveComponent(item.component);
      }
    } else {
      setSelected(item.name);
      setActiveComponent(item.component);
    }
  };

  return (
    <div className="w-[250px] min-h-[1020px] p-4 border-0 border-r-[1px] border-[#17BCBE]">
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
          <li key={item.name}>
            <div
              className={`flex items-center justify-between p-[8px] rounded-lg cursor-pointer w-full
                ${selected === item.name 
                  ? "bg-[#E8F8F9] text-[#108587] border-l-[3px] border-[#17BCBE]" 
                  : "text-[#17BCBE] hover:bg-[#E8F8F9] hover:text-[#108587]"}
              `}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-lg font-medium">{item.name}</span>
              </div>
              {item.subItems && (
                expandedItems[item.name] ? 
                <ChevronDown size={20} /> : 
                <ChevronRight size={20} />
              )}
            </div>
            
            {item.subItems && expandedItems[item.name] && (
              <ul className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <li
                    key={subItem.name}
                    className={`flex items-center p-[8px] rounded-lg cursor-pointer
                      ${selected === subItem.name 
                        ? "bg-[#E8F8F9] text-[#108587] border-l-[3px] border-[#17BCBE]" 
                        : "text-[#17BCBE] hover:bg-[#E8F8F9] hover:text-[#108587]"}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(subItem, true);
                    }}
                  >
                    <span className="text-md font-medium">{subItem.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;