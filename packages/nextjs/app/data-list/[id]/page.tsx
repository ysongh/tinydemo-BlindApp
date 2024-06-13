"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CopyString } from "~~/components/nillion/CopyString";
import { NillionOnboarding } from "~~/components/nillion/NillionOnboarding";
import RetrieveSecretCommand from "~~/components/nillion/RetrieveSecretCommand";
import SecretForm from "~~/components/nillion/SecretForm";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { compute } from "~~/utils/nillion/compute";
import { getUserKeyFromSnap } from "~~/utils/nillion/getUserKeyFromSnap";
import { retrieveSecretInteger } from "~~/utils/nillion/retrieveSecretInteger";
import { storeSecretsInteger } from "~~/utils/nillion/storeSecretsInteger";

interface StringObject {
  [key: string]: string | null;
}

const Home = ({ params }: { params: { id: string } }) => {
  const { address: connectedAddress } = useAccount();
  const [connectedToSnap, setConnectedToSnap] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);

  const [programName] = useState<string>("tinydemo");
  const [computeResult, setComputeResult] = useState<string | null>(null);

  const [storedSecretsNameToStoreId, setStoredSecretsNameToStoreId] = useState<StringObject>({
    guess: null,
  });
  const [parties] = useState<string[]>(["Party1"]);
  const [outputs] = useState<string[]>(["my_output"]);

  const { data } = useScaffoldContractRead({
    contractName: "Tinydemo",
    functionName: "getDataById",
    args: [params.id],
  });

  console.log(data);

  // connect to snap
  async function handleConnectToSnap() {
    const snapResponse = await getUserKeyFromSnap();
    setUserKey(snapResponse?.user_key || null);
    setConnectedToSnap(snapResponse?.connectedToSnap || false);
  }

  async function handleRetrieveInt(secret_name: string, store_id: string | null) {
    if (store_id) {
      const value = await retrieveSecretInteger(nillionClient, store_id, secret_name);
      alert(`${secret_name} is ${value}`);
    }
  }

  // reset nillion values
  const resetNillion = () => {
    setConnectedToSnap(false);
    setUserKey(null);
    setUserId(null);
    setNillion(null);
    setNillionClient(null);
  };

  useEffect(() => {
    // when wallet is disconnected, reset nillion
    if (!connectedAddress) {
      resetNillion();
    }
  }, [connectedAddress]);

  // Initialize nillionClient for use on page
  useEffect(() => {
    if (userKey) {
      const getNillionClientLibrary = async () => {
        const nillionClientUtil = await import("~~/utils/nillion/nillionClient");
        const libraries = await nillionClientUtil.getNillionClient(userKey);
        setNillion(libraries.nillion);
        setNillionClient(libraries.nillionClient);
        return libraries.nillionClient;
      };
      getNillionClientLibrary().then(nillionClient => {
        const user_id = nillionClient.user_id;
        setUserId(user_id);
      });
    }
  }, [userKey]);

  // handle form submit to store secrets with bindings
  async function handleSecretFormSubmit(
    secretName: string,
    secretValue: string,
    permissionedUserIdForRetrieveSecret: string | null,
    permissionedUserIdForUpdateSecret: string | null,
    permissionedUserIdForDeleteSecret: string | null,
    permissionedUserIdForComputeSecret: string | null,
  ) {
    if (data.programId) {
      const partyName = parties[0];
      await storeSecretsInteger(
        nillion,
        nillionClient,
        [{ name: secretName, value: secretValue }],
        data.programId,
        partyName,
        permissionedUserIdForRetrieveSecret ? [permissionedUserIdForRetrieveSecret] : [],
        permissionedUserIdForUpdateSecret ? [permissionedUserIdForUpdateSecret] : [],
        permissionedUserIdForDeleteSecret ? [permissionedUserIdForDeleteSecret] : [],
        permissionedUserIdForComputeSecret ? [permissionedUserIdForComputeSecret] : [],
      ).then(async (store_id: string) => {
        console.log("Secret stored at store_id:", store_id);
        setStoredSecretsNameToStoreId(prevSecrets => ({
          ...prevSecrets,
          [secretName]: store_id,
        }));
      });
    }
  }

  // compute on secrets
  async function handleCompute() {
    if (data.programId) {
      const storeIdList = Object.values(storedSecretsNameToStoreId);
      storeIdList.unshift(data.storeId);
      await compute(nillion, nillionClient, storeIdList, data.programId, outputs[0]).then(
        result => setComputeResult(result),
      );
    }
  }

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5 flex flex-col">
          <h1 className="text-xl">
            <span className="block text-4xl font-bold">Guess the Number</span>
            {!connectedAddress && <p>Connect your MetaMask Flask wallet</p>}
            {connectedAddress && connectedToSnap && !userKey && (
              <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                <button className="btn btn-sm btn-primary mt-4">
                  No Nillion User Key - Generate and store user key here
                </button>
              </a>
            )}
          </h1>

          {connectedAddress && (
            <div className="flex justify-center items-center space-x-2">
              <p className="my-2 font-medium">Connected Wallet Address:</p>
              <Address address={connectedAddress} />
            </div>
          )}

          {connectedAddress && !connectedToSnap && (
            <button className="btn btn-sm btn-primary mt-4" onClick={handleConnectToSnap}>
              Connect to Snap with your Nillion User Key
            </button>
          )}

          {connectedToSnap && (
            <div>
              {userKey && (
                <div>
                  <div className="flex justify-center items-center space-x-2">
                    <p className="my-2 font-medium">
                      🤫 Nillion User Key from{" "}
                      <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                        MetaMask Flask
                      </a>
                      :
                    </p>

                    <CopyString str={userKey} />
                  </div>

                  {userId && (
                    <div className="flex justify-center items-center space-x-2">
                      <p className="my-2 font-medium">Connected as Nillion User ID:</p>
                      <CopyString str={userId} />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            {!connectedToSnap ? (
              <NillionOnboarding />
            ) : (
              <div>
                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-full rounded-3xl my-2 justify-between">
                  <h1 className="text-xl">
                    Guess secret integer with program bindings to the {programName} program
                  </h1>

                  <div className="flex flex-row w-full justify-between items-center my-10 mx-10">
                    {Object.keys(storedSecretsNameToStoreId).map(key => (
                      <div className="flex-1 px-2" key={key}>
                        {!!storedSecretsNameToStoreId[key] && userKey ? (
                          <>
                            <RetrieveSecretCommand
                              secretType="SecretInteger"
                              userKey={userKey}
                              storeId={storedSecretsNameToStoreId[key]}
                              secretName={key}
                              programId={data.programId}
                            />
                            <button
                              className="btn btn-sm btn-primary mt-4"
                              onClick={() => handleRetrieveInt(key, storedSecretsNameToStoreId[key])}
                            >
                              👀 Retrieve SecretInteger
                            </button>
                          </>
                        ) : (
                          <SecretForm
                            secretName={key}
                            onSubmit={handleSecretFormSubmit}
                            isDisabled={!data.programId}
                            secretType="number"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-full rounded-3xl my-2 justify-between">
                  <h1 className="text-xl">
                    Perform blind computation with stored secrets in the {programName} program
                  </h1>
                  {!computeResult && (
                    <button
                      className="btn btn-sm btn-primary mt-4"
                      onClick={handleCompute}
                      disabled={Object.values(storedSecretsNameToStoreId).every(v => !v)}
                    >
                      Compute on {programName}
                    </button>
                  )}
                  {computeResult && <p>✅ Compute result: {computeResult}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
