import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";
import { useLayoutEffect, useMemo, useState } from "react";

function Wallet({ wallet, setAccount, balance, setBalance }) {

	async function onChange(evt) {
		const address = evt.target.value;
		setAccount(wallet.find((account) => account.address === address));
		if (address) {
			const {
				data: { balance },
			} = await server.get(`balance/${address}`);
			setBalance(balance);
		} else {
			setBalance(0);
		}
	}


	return (
		<div className="container wallet">
			<h1>Your Wallet</h1>

			<label>
				Choose your wallet:
				<div style={{flexDirection: "row"}}>
					{ wallet.map((account, index) => {
						return (
							<div key={index}>
								<input type="radio" name="wallet" value={account.address} onChange={onChange} />
								{account.label} - <span onClick={() => { navigator.clipboard.writeText(account.address) }}>{account.address}</span>
							</div>
						);
					})}
				</div>
			</label>

			<div className="balance">Balance: { balance }</div>
		</div>
	);
}

export default Wallet;
