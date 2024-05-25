import { client } from "@/app/client";
import { NFT } from "thirdweb";
import { MediaRenderer } from "thirdweb/react";
import { useState } from "react";
import html2canvas from "html2canvas";

type OwnedNFTsProps = {
    nft: NFT;
    refetch: () => void;
};

export const NFTCard = ({ nft }: OwnedNFTsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const saveAsImage = () => {
        const modalElement = document.getElementById('modal-content');
        if (modalElement) {
            html2canvas(modalElement).then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'nft-share.png';
                link.click();
            });
        }
    };

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
            <p >{nft.metadata.name}</p>
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    width: "30%"
                }}
            >Share</button>
            {isModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div id="modal-content" style={{
                        minWidth: "300px",
                        backgroundColor: "#222",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%"
                        }}>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    border: "none",
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                    cursor: "pointer"
                                }}
                            >Close</button>
                        </div>
                        <h3 style={{ margin: "10px 0" }}>You are about to save your Digital Collectible</h3>
                        <MediaRenderer
                            client={client}
                            src={nft.metadata.image}
                            style={{
                                borderRadius: "10px",
                                marginBottom: "10px"
                            }}
                        />
                        <p >{nft.metadata.name}</p>
                        <button
                            onClick={saveAsImage}
                            style={{
                                border: "none",
                                backgroundColor: "#4CAF50",
                                color: "#fff",
                                padding: "10px",
                                borderRadius: "10px",
                                cursor: "pointer",
                                marginTop: "10px"
                            }}
                        >Save as Image</button>
                    </div>
                </div>
            )}
        </div>
    );
};
