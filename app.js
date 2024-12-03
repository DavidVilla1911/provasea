// Controlliamo se Phantom Wallet è presente
async function checkPhantom() {
  if (window.solana && window.solana.isPhantom) {
    console.log("Phantom wallet detected");
    document.getElementById("connectButton").style.display = "block";
  } else {
    console.log("Phantom wallet not detected");
    document.getElementById("walletInfo").innerText = "Please install Phantom Wallet.";
  }
}

async function connectWallet() {
  try {
    const response = await window.solana.connect();
    console.log("Connected to wallet:", response.publicKey.toString());
    document.getElementById("walletInfo").innerText = `Wallet connected: ${response.publicKey.toString()}`;
  } catch (error) {
    console.error("Error connecting to wallet:", error);
  }
}

document.getElementById("connectButton").addEventListener("click", connectWallet);

checkPhantom();
