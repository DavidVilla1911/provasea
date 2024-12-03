const solanaWeb3 = window.solanaWeb3; // Assicuriamoci che Phantom sia abilitato
const PROGRAM_ID = new solanaWeb3.PublicKey("dRxFhMb8nojoWBLLRKMUHypwhHJYQ8AznUqn9S7d64v"); // Sostituisci con l'ID del programma
const CONNECTION = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl("mainnet-beta"));

let walletPublicKey = null;

// Funzione per connettere il wallet
async function connectWallet() {
  try {
    const response = await window.solana.connect();
    walletPublicKey = response.publicKey;
    document.getElementById("status").innerText = `Connected: ${walletPublicKey}`;
    document.getElementById("buyButton").disabled = false;
    console.log("Wallet connected:", walletPublicKey.toBase58());
  } catch (err) {
    console.error("Wallet connection failed:", err);
    alert("Failed to connect wallet. Please try again.");
  }
}

// Funzione per acquistare Sea Cucumber
async function buySeaCucumber() {
  if (!walletPublicKey) {
    alert("Please connect your wallet first!");
    return;
  }

  try {
    // Costruisci una transazione
    const transaction = new solanaWeb3.Transaction().add(
      new solanaWeb3.TransactionInstruction({
        keys: [{ pubkey: walletPublicKey, isSigner: true, isWritable: false }],
        programId: PROGRAM_ID,
        data: Buffer.from([]), // Modifica qui se il tuo contratto richiede dati specifici
      })
    );

    // Aggiungi blockhash e fee payer
    const { blockhash } = await CONNECTION.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPublicKey;

    // Firma e invia la transazione
    const signedTransaction = await window.solana.signTransaction(transaction);
    const signature = await CONNECTION.sendRawTransaction(signedTransaction.serialize());

    // Conferma la transazione
    await CONNECTION.confirmTransaction(signature);
    alert("Sea Cucumber purchased successfully!");
    console.log("Transaction signature:", signature);
  } catch (err) {
    console.error("Transaction failed:", err);
    alert("Failed to purchase Sea Cucumber. Please try again.");
  }
}

// Associa eventi ai pulsanti
document.getElementById("connectButton").addEventListener("click", connectWallet);
document.getElementById("buyButton").addEventListener("click", buySeaCucumber);
