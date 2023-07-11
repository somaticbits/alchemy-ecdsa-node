import { useState } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils.js";

import server from "./server";
import { keccak256 } from "ethereum-cryptography/keccak.js";

function Transfer({ account, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  // useEffect(() => {
  //   console.log(sendAmount, recipient);
  //   }, [sendAmount, recipient]);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const messageHash = toHex(keccak256(utf8ToBytes(account.address + recipient + sendAmount)));
      const signature = secp256k1.sign(messageHash, account.privateKey).toCompactHex();
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: account.address,
        amount: parseInt(sendAmount),
        publicKey: account.publicKey,
        messageHash: messageHash,
        signature: signature,
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
