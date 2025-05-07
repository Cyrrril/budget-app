// components/Tabs.tsx
import { useState } from "react";

export type TabOption = {
  label: string;
  value: string;
};

export default function Tabs({
  options,
  onChange,
}: {
  options: TabOption[];
  onChange: (tab: string) => void;
}) {
  const [activeTab, setActiveTab] = useState(options[0].value);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChange(tab);
  };

  return (
    <div className="flex justify-center space-x-4 border-b mb-4">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleTabChange(option.value)}
          className={`px-4 py-2 transition-colors duration-200 ${
            activeTab === option.value
              ? "border-b-2 border-pastel-purple-500"
              : "text-gray-500"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
