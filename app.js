// Variabili globali
let walletPublicKey = null;

// ID Programma e Wallet (confermati da te)
const PROGRAM_ID = "dRxFhMb8nojoWBLLRKMUHypwhHJYQ8AznUqn9S7d64v";
const DESTINATION_WALLET = "5ZgZuZNTb3vH7pEq36d9pDyHATcmSf2obD4HbfRagHqx";

// Funzione per connettere il wallet
async function connectWallet() {
  console.log("Tentativo di connessione al wallet...");
  try {
    const response = await window.solana.connect();
    walletPublicKey = response.publicKey;
    document.getElementById("status").innerText = `Connected: ${walletPublicKey}`;
    document.getElementById("buyButton").disabled = false;
    console.log("Wallet connesso:", walletPublicKey.toBase58());
  } catch (err) {
    console.error("Errore di connessione:", err);
    alert("Errore durante la connessione al wallet.");
  }
}

// Funzione per acquistare token
async function purchaseTokens() {
  if (!walletPublicKey) {
    alert("Connetti il wallet prima di acquistare.");
    return;
  }

  try {
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: DESTINATION_WALLET,
        lamports: web3.LAMPORTS_PER_SOL * 0.01, // Modifica quantità di SOL qui
      })
    );

    transaction.feePayer = walletPublicKey;
    const blockhash = await web3.Connection("https://api.mainnet-beta.solana.com").getLatestBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;

    // Firma la transazione con Phantom
    const signedTransaction = await window.solana.signTransaction(transaction);
    console.log("Transazione firmata:", signedTransaction);

    // Invia la transazione alla blockchain
    const signature = await new web3.Connection("https://api.mainnet-beta.solana.com").sendRawTransaction(
      signedTransaction.serialize()
    );

    console.log("Transazione inviata:", signature);
    alert("Acquisto completato con successo!");
  } catch (err) {
    console.error("Errore durante l'acquisto:", err);
    alert("Errore durante l'acquisto.");
  }
}
