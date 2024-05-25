import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";

const nftContractAddress = "0x986Ac063a031813Cf1dd9695A7E9b35fc98673c6";

export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: nftContractAddress
});
