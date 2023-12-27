import React from 'react'
import { useState } from 'react';
import { SlOptions } from "react-icons/sl";

type Props = {
    isFriend: boolean;
  }

function Options({isFriend}: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    console.log("==== ", isFriend);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
        <div className={`${isFriend ? "block" : "hidden"} flex absolute top-36 left-52 medium:top-[120px] xMedium:top-32 xMedium:left-8`}>
            <button id="dropdownDefaultButton" onClick={toggleDropdown} data-dropdown-toggle="dropdown" className="text-white text-3xl focus:outline-none font-medium rounded-lg py-2.5 px-1 inline-flex" type="button"><SlOptions /></button>

            <div id="dropdown" className={`z-10 ${isOpen ? "block" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-32 dark:bg-[#323232]`}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">delete</a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">block</a>
                  </li>
                </ul>
            </div>
        </div>
    </>
  )
}

export default Options