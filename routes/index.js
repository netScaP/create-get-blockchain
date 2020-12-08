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

  const walletsList = await deployedContract.methods.getWallets().call()
  res.render("index", {
    title: "Express",
    walletsList: walletsList.map(web3.utils.toUtf8).filter((e) => !!e),
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
  const accounts = await web3.eth.getAccounts()

  try {
    const response = await deployedContract.methods.removeWallet(index).send({
      from: accounts[1],
    })
    res.send(response)
  } catch (err) {
    next(err)
  }
})

module.exports = router
