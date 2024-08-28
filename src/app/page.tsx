"use client"
import WalletActions from "@/components/WalletActions";
import '@near-wallet-selector/modal-ui/styles.css';
import { useState } from "react";
import NFTDropActions from "@/components/NFTDropActions";

export default function Home() {
  const [img, setImg] = useState(null);
  const [msg, setMsg] = useState('Upload an Image')
  const [file, setFile] = useState<File>()

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setFile(file)
        }
    };

    const uploadFile = async (file: File) => {
      setMsg('Uploading...')
    
      const res: any = await fetch(
        "https://ipfs.near.social/add",
        {
          method: "POST",
          headers: { Accept: "application/json" },
          body: file
        }
      )

      if (res.ok) {
        const data = await res.json();
        console.log('Response Data:', data);
        setImg(data.cid); // Assuming the response contains a 'cid' field
        setMsg('Image Uploaded Successfully');
      } else {
        setMsg('Upload failed with status ' + res.status);
      }
      setMsg('Upload an Image')
    }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>NEAR Wallet Example</h1>
        <WalletActions />
        <NFTDropActions />
        {/* <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {file && <button onClick={()=> uploadFile(file)}>Upload Image</button>}
          <h2>{img}</h2>
        </div> */}
      </div>
    </main>
  );
}