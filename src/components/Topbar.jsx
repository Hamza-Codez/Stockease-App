import { Menu, Search } from 'lucide-react'; // Importing search icon from lucide-react
import React from 'react';

const Topbar = () => {
  return (
    <div className="w-[1100px] h-[70px] border-b-[1px] border-[#17BCBE] flex gap-4.5 justify-start items-center px-[12px] py-[16px] bg-white">
      {/* Menu Fries Icon */}
      <div className="flex items-center gap-[10px]">
        <div className="w-[40px] h-[35px] rounded-md p-[4px] flex justify-center items-center cursor-pointer bg-[#E8F8F9]">
          <Menu size={24} className='text-[#108587]'/>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center justify-between bg-[#E8F8F9] w-[430px] h-[42px] px-[10px] py-[8px] rounded-lg border-[1px] border-[#20dbdf] ">
        {/* Search Icon inside the search bar */}
        <Search size={20} className="absolute left-[10px] text-[#17BCBE]" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full h-full pl-[30px] pr-[16px] py-[4px] rounded-lg border-0 outline-none text-[#108587]"
        />
      </div>

      {/* Search Button */}
      <button className="bg-[#108587] hover:bg-[#17BCBE] text-white py-[6px] px-[11px] rounded-md cursor-pointer">
        Search
      </button>
    </div>
  );
};

export default Topbar;
