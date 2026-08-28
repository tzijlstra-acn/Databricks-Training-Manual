"use client";

import { useState } from "react";
import {
  Folder,
  Clock,
  Database,
  Workflow,
  Cpu,
  Store,
  Terminal,
  Search,
  LayoutDashboard,
  Sparkles,
  Bell,
  X,
  ChevronRight,
  Users,
  Lightbulb,
  BookOpen,
} from "lucide-react";
import { workspaceSidebarItems } from "@/data/platformComponents";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  folder: <Folder className="w-4 h-4" />,
  clock: <Clock className="w-4 h-4" />,
  database: <Database className="w-4 h-4" />,
  workflow: <Workflow className="w-4 h-4" />,
  cpu: <Cpu className="w-4 h-4" />,
  store: <Store className="w-4 h-4" />,
  terminal: <Terminal className="w-4 h-4" />,
  search: <Search className="w-4 h-4" />,
  "layout-dashboard": <LayoutDashboard className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  bell: <Bell className="w-4 h-4" />,
};

type SidebarItem = (typeof workspaceSidebarItems)[number];

export function WorkspaceExplorer() {
  const [activeItem, setActiveItem] = useState<SidebarItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="w-full rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
      {/* Title bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 max-w-sm mx-auto text-center">
            adb-1234567890.1.azuredatabricks.net
          </div>
        </div>
        <span className="text-xs text-gray-400 font-medium">Databricks Workspace</span>
      </div>

      <div className="flex" style={{ height: 480 }}>
        {/* Left sidebar */}
        <div className="w-52 bg-[#1A1A2E] flex flex-col border-r border-[#2D2D4E] flex-shrink-0">
          {/* Brand bar */}
          <div className="px-4 py-3 border-b border-[#2D2D4E] flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF3621] rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">D</span>
            </div>
            <span className="text-white text-sm font-semibold">Databricks</span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto py-2">
            {workspaceSidebarItems.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveItem(activeItem?.id === item.id ? null : item)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left",
                    activeItem?.id === item.id
                      ? "bg-[#2D2D4E] text-white"
                      : "text-gray-300 hover:bg-[#2D2D4E] hover:text-white"
                  )}
                >
                  <span style={{ color: activeItem?.id === item.id ? item.color : undefined }}>
                    {iconMap[item.icon] ?? <Folder className="w-4 h-4" />}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {/* Pulsing hotspot */}
                  <span className="relative flex h-2 w-2">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: item.color }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: item.color }}
                    />
                  </span>
                </button>

                {/* Hover tooltip */}
                {hoveredItem === item.id && activeItem?.id !== item.id && (
                  <div className="absolute left-full top-0 z-50 ml-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-3 pointer-events-none">
                    <p className="text-xs font-semibold text-gray-800 mb-1">{item.label}</p>
                    <p className="text-xs text-gray-500 leading-snug">{item.description}</p>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Main content area */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="border-b border-gray-100 px-6 py-3 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ChevronRight className="w-3 h-3" />
              <span className="font-medium text-gray-700">
                {activeItem ? activeItem.label : "Select an item from the sidebar"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-400">Search...</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {!activeItem ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
                  <LayoutDashboard className="w-8 h-8 text-primary-800" />
                </div>
                <div>
                  <p className="text-gray-700 font-semibold">Explore the Workspace</p>
                  <p className="text-sm text-gray-400 mt-1 max-w-xs">
                    Click any item in the left sidebar to learn what it does, when to use it, and who uses it.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  {workspaceSidebarItems.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                    >
                      {iconMap[item.icon]}
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-lg">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: activeItem.color }}
                    >
                      {iconMap[activeItem.icon]}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{activeItem.label}</h3>
                      <p className="text-xs text-gray-400">Databricks sidebar section</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveItem(null)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Description card */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-700">What is it?</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-6">{activeItem.description}</p>
                </div>

                {/* When to use */}
                <div className="rounded-2xl border p-4 mb-4" style={{ borderColor: activeItem.color + "40", backgroundColor: activeItem.color + "0A" }}>
                  <div className="flex items-start gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: activeItem.color }} />
                    <p className="text-sm font-medium text-gray-700">When to use it</p>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-6">{activeItem.whenToUse}</p>
                </div>

                {/* Who uses it */}
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-700">Who uses it</p>
                  </div>
                  <div className="pl-6 flex flex-wrap gap-2">
                    {activeItem.whoUses.split(", ").map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Navigate hint */}
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Click another sidebar item to explore it, or click{" "}
                  <span className="font-medium">×</span> to close.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
