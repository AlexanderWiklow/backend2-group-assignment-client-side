// import Image from "next/image";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import PostList from "../components/PostList";

const inter = Inter({ subsets: ["latin"] });

import AppLayout from "@/components/AppLayout";
import Nav from "@/components/Nav";

export default function Home() {
  return <AppLayout Nav={Nav} Main={Main} Sidebar={Sidebar} title={"Home"} />;
}

function Main() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <h1>Logged in view</h1>
    </main>
  );
}

function Sidebar() {
  return (
    <div className="mt-16">
      <PostList />
    </div>
  );
}
