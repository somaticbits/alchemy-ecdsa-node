import { useState, useEffect } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";

import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";

function App() {
	const [balance, setBalance] = useState(0);
	const [account, setAccount] = useState({});
	const [wallet, setWallet] = useState([]);

	useEffect(() => {
		const temp = [];
		temp.push({
			label: "bank",
			address: "0x04b165fb5654c8b78c76936923dab4d62690f458",
			publicKey: "03d0f72a46891a62e9617e3ed70fb6716981726a3afcbb3a8b1c629a96645be656",
			privateKey: "b14046c76de31eb47ee48af998d825c371891e083b410581ee4bbc494f9ed2f9"
		});
		// Generate 4 accounts
		for (let i = 0; i < 4; i++) {
			const privateKey = secp256k1.utils.randomPrivateKey();
			const publicKey = secp256k1.getPublicKey(privateKey);
			const address = `0x` + toHex(keccak256(publicKey).slice(-20));
			const account = { label: `0x${i}`, address: address, publicKey: toHex(publicKey), privateKey: toHex(privateKey) };
			temp.push(account);
		}
		setWallet(temp);
	}, [])

	return (
		<div className="app">
			{ wallet.length !== 0 ? <Wallet wallet={wallet} setAccount={setAccount} balance={balance} setBalance={setBalance} /> : null }
			<Transfer setBalance={setBalance} account={account} />
		</div>
	);
}

export default App;
