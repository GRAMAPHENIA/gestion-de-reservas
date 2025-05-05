"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function LayoutHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onOpen={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-grow" />
    </>
  );
}
