const fs = require("fs")
const express = require("express")
const router = express.Router()
const Web3 = require("web3")

const bytecode = fs.readFileSync("./contracts_Wallet_sol_Wallet.bin").toString()
const abi = JSON.parse(
  fs.readFileSync("./contracts_Wallet_sol_Wallet.abi").toString()
)
const web3 = new Web3("http://localhost:8545")
let deployedContract = new web3.eth.Contract(abi)
const listOfWallets = ["One", "Two", "Three"]

web3.eth
  .getAccounts()
  .then((accounts) => {
    return deployedContract
      .deploy({
        data: bytecode,
        arguments: [listOfWallets.map((name) => web3.utils.fromAscii(name))],
      })
      .send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: web3.utils.toWei("0.00003", "ether"),
      })
  })
  .then((newContractInstance) => {
    deployedContract.options.address = newContractInstance.options.address
  })

/* GET home page. */
router.get("/", async (req, res, next) => {
  const accounts = await web3.eth.getAccounts()
  console.log(accounts)

  const walletsList = await deployedContract.methods.getWallets().call()
  console.log(walletsList)
  console.log(web3.utils.toAscii(walletsList[0]))
  // const votes = await Promise.all(listOfCandidates.map(async name => await deployedContract.methods.totalVotesFor(web3.utils.asciiToHex(name)).call()));
  // const votesCount = listOfCandidates.reduce((obj, name, i) => {
  //   obj[name] = votes[i];
  //   return obj;
  // }, {});
  res.render("index", {
    title: "Express",
    walletsList: walletsList.map(web3.utils.toAscii),
    addresses: accounts,
  })
})

router.post("/", async (req, res, next) => {
  try {
    const response = await deployedContract.methods
      .addWallet(web3.utils.fromAscii(req.body.walletName))
      .send({
        from: req.body.address,
      })
    res.send(response)
  } catch (err) {
    next(err)
  }
})

router.delete("/:index", async (req, res, next) => {
  const {
    params: { index },
  } = req

  try {
    const response = await deployedContract.methods
      .removeWallet(web3.utils.asciiToHex(index))
      .send({
        from: req.body.address,
      })
    res.send(response)
  } catch (err) {
    next(err)
  }
})

module.exports = router
