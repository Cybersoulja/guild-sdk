/**
 * Create Guild Profile Example
 *
 * This example demonstrates how to create a guild profile using the Guild SDK.
 * It shows how to:
 *   - Initialize the Guild client
 *   - Create a signer from a wallet
 *   - Create a guild with a name, description, and a free-to-join role
 *
 * Usage:
 *   PRIVATE_KEY=<your-private-key> npm start
 *
 * The wallet address 0x99295ff548fe9760494a005855a46a958b02a33c is used as an
 * example — replace the PRIVATE_KEY env var with your own key when running.
 */

import { createGuildClient, createSigner } from "@guildxyz/sdk";
import { Wallet } from "ethers";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const GUILD_PROFILES = [
  {
    name: "Web3 Builders",
    urlName: "web3-builders",
    description:
      "A community for developers building on-chain applications, protocols, and tooling.",
  },
  {
    name: "DeFi Explorers",
    urlName: "defi-explorers",
    description:
      "Discover and discuss the latest in decentralised finance — AMMs, lending protocols, and yield strategies.",
  },
  {
    name: "NFT Creators Collective",
    urlName: "nft-creators-collective",
    description:
      "Artists and collectors shaping the future of digital ownership through NFTs.",
  },
  {
    name: "DAO Governance Forum",
    urlName: "dao-governance-forum",
    description:
      "A space for DAO contributors to collaborate on proposals, voting, and on-chain governance.",
  },
  {
    name: "Crypto Security Guild",
    urlName: "crypto-security-guild",
    description:
      "White-hats, auditors, and researchers dedicated to making web3 safer for everyone.",
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  // Resolve the private key from the environment, or fall back to a random
  // wallet for demonstration purposes.
  const privateKey = process.env.PRIVATE_KEY;
  const wallet = privateKey ? new Wallet(privateKey) : Wallet.createRandom();

  console.log(`Using wallet: ${wallet.address}`);

  const client = createGuildClient("create-guild-profile-example");
  const signer = createSigner.fromEthersWallet(wallet, {
    msg: "Create my Guild profile",
  });

  // Pick one of the brainstormed guild ideas (index can be overridden via env)
  const profileIndex = Number(process.env.PROFILE_INDEX ?? 0);
  const profile = GUILD_PROFILES[profileIndex % GUILD_PROFILES.length];

  console.log(`\nCreating guild: "${profile.name}"`);
  console.log(`Description   : ${profile.description}\n`);

  const created = await client.guild.create(
    {
      name: profile.name,
      urlName: profile.urlName,
      description: profile.description,
      contacts: [],
      // Every guild needs at least one role.  We add a free-access role so
      // anyone can join and explore the community.
      roles: [
        {
          name: "Member",
          requirements: [{ type: "FREE" }],
        },
      ],
    },
    signer
  );

  console.log("Guild created successfully!");
  console.log(`  id      : ${created.id}`);
  console.log(`  urlName : ${created.urlName}`);
  console.log(`  url     : https://guild.xyz/${created.urlName}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
