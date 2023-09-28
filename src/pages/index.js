import { useEffect, useState } from "react";
import { signTransaction } from "../components/signTransaction";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";

function CreateWallet() {
  const [data, setData] = useState({
    address: "",
    key: "",
    mnemonic: "",
    signTransaction: "",
  });
  const onGenerateWallet = () => {
    const network = bitcoin.networks.bitcoin;
    const path = `m/49'/0'/0'/0`;

    let mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    let root = bip32.fromSeed(seed, network);

    let account = root.derivePath(path);
    let node = account.derive(0).derive(0);
    let btcAddress = bitcoin.payments.p2pkh({
      pubkey: node.publicKey,
      network: network,
    }).address;
    const tempObj = {
      address: btcAddress,
      key: node.toWIF(),
      mnemonic: mnemonic,
    };
    setData(tempObj);
  };

  const onGetSignTransaction = () => {
    const signedTxHex = signTransaction({
      txData: {
        inputs: [
          {
            txHash:
              "e621a54bae12ff40bd81530f572b6a22617051c96c5b1add33e319778f77e46c", // we need to here pass previous transaction hash that's why I pass here this wallet transaction hash: wallet address:  my3HBg8vGiiuemj6fHbUZTxh1GnFspay9g (https://live.blockcypher.com/btc-testnet/tx/e621a54bae12ff40bd81530f572b6a22617051c96c5b1add33e319778f77e46c/)
            vout: 0,
          },
        ],
        outputs: [
          {
            toAddress: data.address, // This is the receiver address that we have generated
            amount: 10, // This value in satoshis
          },
        ],
      },
      privateKeyWIF: data.key,
    });
    setData({ ...data, ["signTransaction"]: signedTxHex });
  };
  return (
    <div className='container'>
      <h1>Create a Bitcoin Wallet</h1>
      <button onClick={onGenerateWallet} className='generate-button'>
        Generate BTC testnet wallet
      </button>

      {data.address && (
        <div className='wallet-info'>
          <p>
            <strong>Address:</strong> {data.address}
          </p>
          <p>
            <strong>Private key:</strong> {data.key}
          </p>
          <p>
            <strong>Mnemonic:</strong> {data.mnemonic}
          </p>
        </div>
      )}
      <div className='container'>
        <h1>Sign Trasaction</h1>
        <button onClick={onGetSignTransaction} className='generate-button'>
          Sign Transaction Tx
        </button>

        {data.signTransaction && (
          <div className='wallet-info'>
            <p>
              <strong>Sign Transaction:</strong> {data.signTransaction}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
export default CreateWallet;
