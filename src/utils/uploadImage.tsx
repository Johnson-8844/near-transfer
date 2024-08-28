import { useCallback } from "react";
import { create } from "ipfs-http-client";

// Create an IPFS client
const ipfsClient = create({ url: 'https://ipfs.near.social' });

export const useUploadImage = () => {
    const uploadImage = useCallback(async (file: File): Promise<string | null> => {
        try {
            // Add the file to IPFS
            const added = await ipfsClient.add(file);
            
            // Get the CID
            const cid = added.path;
            return cid;
        } catch (error) {
            console.error("Error uploading image to IPFS", error);
            return null;
        }
    }, []);

    return { uploadImage };
};
