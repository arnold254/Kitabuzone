import { Menu } from "@headlessui/react";

const FilterDropdown = ({ label, value, options, onChange }) => (
  <Menu as="div" className="relative">
    <Menu.Button className="bg-purple-200 text-purple-900 px-3 py-1.5 rounded flex items-center justify-between hover:bg-purple-300 text-sm">
      {value || label} <span>⏷</span>
    </Menu.Button>
    <Menu.Items className="absolute z-10 mt-1 w-32 bg-white text-purple-900 rounded shadow-lg">
      {options.map((option) => (
        <Menu.Item key={option}>
          {({ active }) => (
            <button
              className={`w-full text-left px-3 py-1 text-sm ${active ? "bg-purple-100" : ""}`}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          )}
        </Menu.Item>
      ))}
      <Menu.Item>
        {({ active }) => (
          <button
            className={`w-full text-left px-3 py-1 text-sm ${active ? "bg-purple-100" : ""}`}
            onClick={() => onChange("")}
          >
            Clear
          </button>
        )}
      </Menu.Item>
    </Menu.Items>
  </Menu>
);

export default FilterDropdown;