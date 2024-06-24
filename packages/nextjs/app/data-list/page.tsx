"use client";

import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const router = useRouter();

  const { data: list } = useScaffoldContractRead({
    contractName: "Tinydemo",
    functionName: "getList",
  });

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5 flex flex-col">
          <h1 className="text-xl mb-3">
            <span className="block text-4xl font-bold text-center">
              Data List to guess
            </span>
          </h1>
          <div>
            {list?.map((l, index) => (
              <div className="bg-blue-100 hover:bg-blue-300 transition-colors p-3 rounded-xl shadow-lg" key={index}>
                <p>Store Id: {l.storeId}</p>
                <p>Program Id: {l.programId}</p>
                <button
                  className={`mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    " bg-indigo-600"
                  }`}
                  onClick={() => router.push(`/data-list/${index}`)}
                >
                  View
                </button>
              </div>
            ))}
            {!list?.length && <p className="text-red-500 text-xl">No game yet...</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
