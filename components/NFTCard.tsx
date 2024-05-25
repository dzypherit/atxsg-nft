import { client } from "@/app/client";
import { NFT } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";

type OwnedNFTsProps = {
    nft: NFT;
    refetch: () => void;
};

export const NFTCard = ({ nft }: OwnedNFTsProps) => {

    return (
        <div style={{ margin: "10px" }}>
            <MediaRenderer
                client={client}
                src={nft.metadata.image}
                style={{
                    borderRadius: "10px",
                    marginBottom: "10px",
                    height: "200px",
                    width: "200px"
                }}
            />
            <p style={{ margin: "0 10px 10px 10px"}}>{nft.metadata.name}</p>
            
                    
        </div>
    )
};