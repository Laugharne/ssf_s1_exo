
import { Connection, Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { Command } from 'commander';
import * as fs from 'fs/promises';
import * as path from 'path';

//const connection = new Connection("https://api.devnet.solana.com");
const connection = new Connection("http://localhost:8899");
const program    = new Command();
const web3       = require("@solana/web3.js");


program.version('1.0.0');

program
  .command('wallet')
  .description('Create wallet !')
  .option('-n, --name <name>', 'Name of the person to bid wallet', 'World')
  .action(async (options) => {
    console.log("");

    const walletFile = options.name+".wallet.json";
    console.log("Create Key Pair into \""+walletFile+"\" file !");

    const wallet = Keypair.generate();
    console.log(wallet.publicKey.toBase58());
    
    const privateKeyString = Buffer.from(wallet.secretKey).toString('base64');

    const walletData = {
      publicKey: wallet.publicKey.toBase58(),
      privateKey: privateKeyString
    };

    await fs.writeFile("./"+walletFile, JSON.stringify(walletData, null, 2), 'utf8');
    console.log("");

});

program
  .command('balance')
  .description('Get balance of an account wallet')
  .option('-n, --name <name>', 'Name of the person to bid balance', 'World')
  .action(async (options) => {
    console.log("");

    const walletFile = options.name+".wallet.json";
    console.log("Get balance from \""+walletFile+"\" file !");
    const privateKey = await readWalletFile("./"+walletFile);
    if(!privateKey) {
      console.log('No Private Key found');
      return;
    }

    const wallet = Keypair.fromSecretKey(
      privateKey,
    );
    //console.log(wallet.publicKey.toBase58());
    //console.log(Buffer.from(wallet.secretKey).toString('base64'));
    const balance = await connection.getBalance(wallet.publicKey);
    console.log("Balance ("+options.name+"): " + (balance/web3.LAMPORTS_PER_SOL));
    console.log("");

});

program
  .command('airdrop')
  .description('Get airdrop to someone')
  .option('-n, --name <name>', 'Name of the person to bid airdrop', 'World')
  .option('-a, --amount <amount>', 'Airdrop amount', 'World')
  .action(async (options) => {
    console.log("");

    const walletFile = options.name+".wallet.json";
    console.log("Get aidrop to \""+options.name+"\" !");
    const privateKey = await readWalletFile("./"+walletFile);
    if(!privateKey) {
      console.log('No Private Key found');
      return;
    }

    const wallet = Keypair.fromSecretKey(
      privateKey,
    );
    //console.log(wallet.publicKey.toBase58());
    //console.log(Buffer.from(wallet.secretKey).toString('base64'));
    const amount = parseFloat(options.amount);
    const airdrop = await connection.requestAirdrop(
      wallet.publicKey,
      amount * web3.LAMPORTS_PER_SOL,
    );
    console.log("");
    console.log("(Please wait few seconds before any other operation...)");
    console.log("");

});

program
  .command('transfer')
  .description('Transfer SOL from someone to another one')
  .option('-f, --from <from>', 'Name of the person', 'World')
  .option('-t, --to <to>', 'Name of the person', 'World')
  .option('-a, --amount <amount>', 'amount', 'World')
  .action(async (options) => {
    console.log("");

    let walletFile;
    let privateKey;

    walletFile = options.from+".wallet.json";
    console.log("Get data (from) \""+options.from+"\" !");
    privateKey = await readWalletFile("./"+walletFile);
    if(!privateKey) {
      console.log('No Private Key found (from)');
      return;
    }

    const from = Keypair.fromSecretKey(
      privateKey,
    );
    console.log(from.publicKey.toBase58());

    walletFile = options.to+".wallet.json";
    console.log("Get data (to) \""+options.to+"\" !");
    privateKey = await readWalletFile("./"+walletFile);
    if(!privateKey) {
      console.log('No Private Key found (to)');
      return;
    }

    const to = Keypair.fromSecretKey(
      privateKey,
    );
    console.log(to.publicKey.toBase58());

    const amount = parseFloat(options.amount);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey  : to.publicKey,
        lamports  : amount * web3.LAMPORTS_PER_SOL,
      })
    );
  
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer        = from.publicKey;
    tx.partialSign(from);

    const serializedTx = tx.serialize();
    const signature    = await connection.sendRawTransaction(serializedTx);
    console.log("Signature: ", signature);
  
    console.log("");
    console.log("(Please wait few seconds before any other operation...)");
    console.log("");

});




async function readWalletFile(fileName: string) {
  const filePath = path.resolve(__dirname, fileName);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const walletData = JSON.parse(data);

    // Convertir la chaîne de caractères en Uint8Array pour la clé privée
    const privateKey = Buffer.from(walletData.privateKey, 'base64');
    return privateKey;
  } catch (error) {
    console.error(`Failed to read wallet file "${filePath}":`, error);
    return null;
  }
}


program.parse(process.argv);
