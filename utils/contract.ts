import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";

const nftContractAddress = "0xa6Abe6B3F339F5AB0151D94043ed5B56730441D7";

export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: nftContractAddress
});
