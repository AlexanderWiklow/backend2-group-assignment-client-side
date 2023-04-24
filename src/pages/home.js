// import Image from "next/image";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import PostList from "../components/PostList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Logged in view</h1>
      <PostList />
    </main>
  );
}
