import * as bitcoin from "bitcoinjs-lib";

function signTransaction({ txData, privateKeyWIF }) {
  try {
    const network = bitcoin.networks.bitcoin;
    const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, network);
    const txb = new bitcoin.TransactionBuilder(network);
    txData.inputs.forEach((input) => {
      txb.addInput(input.txHash, input.vout);
    });

    txData.outputs.forEach((output) => {
      txb.addOutput(output.toAddress, output.amount);
    });

    txData.inputs.forEach((input, index) => {
      txb.sign(index, keyPair);
    });

    const tx = txb.build();
    return tx.toHex();
  } catch (error) {
    return null;
  }
}

module.exports = { signTransaction };
