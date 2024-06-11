"use client";

import type { NextPage } from "next";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { data: list } = useScaffoldContractRead({
    contractName: "Tinydemo",
    functionName: "getList",
  });

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5 flex flex-col">
          <h1 className="text-xl">
            <span className="block text-4xl font-bold text-center">
              Data List to guess
            </span>
          </h1>
          <div>
            {list?.map((l, index) => (
              <div key={index}>
                <p>Store Id: {l.storeId}</p>
                <p>Program Id: {l.programId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
