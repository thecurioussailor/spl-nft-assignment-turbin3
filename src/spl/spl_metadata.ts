import "dotenv/config";
import { createSignerFromKeypair, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import wallet from "../../devnet-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createMetadataAccountV3, CreateMetadataAccountV3InstructionAccounts, CreateMetadataAccountV3InstructionArgs, DataV2Args } from "@metaplex-foundation/mpl-token-metadata";
import bs58 from "bs58"

//paste your mint address got from spl_init.ts
const mint = publicKey("69uQNRKgPSxrHYULrNKVC9DHZ4oDS5496kg5wyj8ju4w");

const umi = createUmi(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com");

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));


(async () => {
    try {

        const accounts : CreateMetadataAccountV3InstructionAccounts = {
            mint,
            mintAuthority: signer
        }

        //change the metadata
        const data: DataV2Args = {
            name: "Ethan Hunt Supremacy",
            symbol: "EHS",
            uri: "https://ivory-additional-flyingfish-166.mypinata.cloud/ipfs/bafkreig4axcrdozkdzlnbst3bneyrhrhohgn2luedldogzve2hx47z4o2m",
            sellerFeeBasisPoints: 1,
            creators: null,
            collection: null,
            uses: null
        }

        const args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: true,
            collectionDetails: null
        }
        const tx = createMetadataAccountV3(umi, {
            ...accounts,
            ...args
        })

        const result = await tx.sendAndConfirm(umi);
        console.log("signature: ",bs58.encode(Buffer.from(result.signature)));
    }
    catch (error) {
        console.log("error",error);
    }
})()

//signature:  3bg5VXdJWVXgjudqUuj89ofZ25W8genSvTq8fBu9mDeyw2DUSH9jwCynbhyFuzYSiYsrCzsppGcq4XE82y8DTehR