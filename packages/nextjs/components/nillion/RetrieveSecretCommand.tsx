import { CopyString } from "~~/components/nillion/CopyString";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { retrieveSecretCommand } from "~~/utils/nillion/retrieveSecretCommand";

const RetrieveSecretCommand: React.FC<{
  userKey: string | null;
  storeId: string | null;
  secretName: string;
  secretType: string;
  programId: string | null;
  hide: boolean;
}> = ({ userKey, storeId, secretName, secretType, programId, hide }) => {

  const { writeAsync: creatData} = useScaffoldContractWrite({
    contractName: "Tinydemo",
    functionName: "creatData",
    args: [programId, storeId],
    blockConfirmations: 1,
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    !process.env.NEXT_PUBLIC_USE_NILLION_CONFIG && (
      <span>
        ✅ Stored {secretType} {secretName} <br /> <CopyString str={storeId || ""} textBefore={`store_id: `} full />
        <br />
        <p>
          👀 Optional: Copy and run the following command to retrieve-secret from the command line to see the value of{" "}
          {secretName} using the nillion SDK tool
        </p>
        <CopyString str={retrieveSecretCommand(userKey, storeId, secretName)} start={30} end={30} code />
        {!hide && (
          <button
            className={`mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 }`}
            onClick={() => creatData()}>
            Confirm and Save On-Chain
          </button>
        )}
      </span>
    )
  );
};

export default RetrieveSecretCommand;
