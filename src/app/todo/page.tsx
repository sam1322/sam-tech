"use client";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="w-full h-screen flex justify-center p-10">
      <h1 className="text-3xl">Todo List</h1>
      
    </div>
  );
};

export default page;
