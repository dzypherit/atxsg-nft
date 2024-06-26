'use client';

import Image from "next/image";
import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useReadContract, darkTheme,  } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { client } from "./client";
import { defineChain, getContract, toEther,} from "thirdweb";
import { base } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getNFTs, ownerOf, totalSupply, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { NFTCard } from "../../components/NFTCard"
import { NFT } from "thirdweb";
import { NFT_CONTRACT } from "../../utils/contract";
import { useEffect, useState } from "react";


import {
  createWallet,
  walletConnect,
  inAppWallet,
} from "thirdweb/wallets";

export default function Home() {
  const account = useActiveAccount();

  // Replace the chain with the chain you want to connect to
  const chain = defineChain( base );

  const [quantity, setQuantity] = useState(1);

  // Replace the address with the address of the deployed contract
  const contract = getContract({
    client: client,
    chain: chain,
    address: "0xa6Abe6B3F339F5AB0151D94043ed5B56730441D7"
  });

  const { data: contractMetadata, isLoading: isContractMetadataLaoding } = useReadContract( getContractMetadata,
    { contract: contract }
  );

  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } = useReadContract( getTotalClaimedSupply,
    { contract: contract}
  );

  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract( nextTokenIdToMint,
    { contract: contract }
  );

  const { data: claimCondition } = useReadContract( getActiveClaimCondition,
    { contract: contract }
  );

  const getPrice = (quantity: number) => {
    const total = quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
    return toEther(BigInt(total));
  }

  const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);

  const getOwnedNFTs = async () => {
    let ownedNFTs: NFT[] = [];

    const totalNFTSupply = await totalSupply({
        contract: NFT_CONTRACT,
    });
    const nfts = await getNFTs({
        contract: NFT_CONTRACT,
        start: 0,
        count: parseInt(totalNFTSupply.toString()),
    });
    
    for (let nft of nfts) {
        const owner = await ownerOf({
            contract: NFT_CONTRACT,
            tokenId: nft.id,
        });
        if (owner === account?.address) {
            ownedNFTs.push(nft);
        }
    }
    setOwnedNFTs(ownedNFTs);
};

useEffect(() => {
    if(account) {
        getOwnedNFTs();
    }
}, [account]);

  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    walletConnect(),
    inAppWallet({
      auth: {
        options: [
          "email",
          "google",
          "apple",
          "facebook",
          "phone",
        ],
      },
    }),
    createWallet("com.trustwallet.app"),
    createWallet("me.rainbow"),
  ];

  return (
    <main className="p-4 pb-10 min-h-screen flex items-center justify-center container max-w-screen-lg mx-auto">
    <div className="py-20 text-center">
      <Header />
      <ConnectButton
        client={client}
        wallets={wallets}
        accountAbstraction={{
          chain: base,
          factoryAddress: process.env.KALUPAY_SMARTWALLET_FACTORY_ADDRESS,
          gasless: true,
        }}
        theme={darkTheme({
          colors: {
            accentText: "#ff33e4",
            accentButtonBg: "#ff33e4",
          },
        })}
        connectButton={{ label: "Login" }}
        connectModal={{
          size: "wide",
          title: "Login",
        }}
      />
      <div className="flex flex-col items-center mt-4">
        {isContractMetadataLaoding ? (
          <p>Loading...</p>
        ) : (
          <>
            <MediaRenderer
              client={client}
              src={contractMetadata?.image}
              className="rounded-xl max-w-full h-auto"
            />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mt-4">
              {contractMetadata?.name}
            </h2>
            <p className="text-base md:text-lg lg:text-xl mt-2">
              {contractMetadata?.description}
            </p>
          </>
        )}
        {isClaimedSupplyLoading || isTotalSupplyLoading ? (
          <p>Loading...</p>
        ) : (
          <p className="text-lg mt-2 font-bold">
            Total Claimed: {claimedSupply?.toString()}
          </p>
        )}
        <br /> <br />
        {account ? (
          <div> 
        {ownedNFTs && ownedNFTs.length <=0 ? ( 
        <div>
          <TransactionButton
            transaction={() => claimTo({
              contract: contract,
              to: account?.address || "",
              quantity: BigInt(quantity),
            })}
            onTransactionConfirmed={async () => {
              alert("Digital Collectible Claimed! \n\nBelow, you can check your Digital Collectibles. \n\n\nIf you don't see your claimed Digital Collectibles, simply refresh the app to check.");
              setQuantity(1);
            }}
          >
            {`Claim Digital Collectible`}
          </TransactionButton>
        </div> ) : (<p>You have already claimed this Digital Collectible.</p>)}
        
        <br /> <br />
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold">Your Digital Collectibles</h2>
        <br /> <br />
        <div className="flex flex-wrap justify-center">
          {ownedNFTs && ownedNFTs.length > 0 ? (
            ownedNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                refetch={getOwnedNFTs}
              />
            ))
          ) : (
            <p>You currently own 0 digital collectibles. If it's been over five minutes and the items are still not appearing after refreshing the app, please contact <b>support@goshenlabs.tech</b> for assistance.</p>
          )}
        </div>
        </div>
        ): (<p>You must login to claim this Digital Collectible.</p>)}
      </div>
    </div>
  </main>
  );
}

function Header() {
  return (
    <header className=" flex-row items-center">

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        ATxSG Digital Collectibles
      </h1>
    </header>
  );
}