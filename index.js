import { ethers } from "./ethers.5.6.esm.min.js"
import { abi, ContractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
//console.log(ethers)

async function connect() {
    console.log("Conecting Wallet!")
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected"
    } else {
        connectButton.innerHTML = "No Wallet"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        //provider / coccention to de blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer / wallet / someone to fund and with gas
        const signer = provider.getSigner()
        //console.log(signer)
        //console.log(ethers.utils.parseEther(ethAmount))
        // the contrat that we are interactin with:
        //     - ABI and Address
        const contract = new ethers.Contract(ContractAddress, abi, signer)
        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransactionMine(txResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(txResponse, provider) {
    console.log(`mining ${txResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `completed with ${txReceipt.confirmations} confirmations`
            )
            resolve()
        })
    })
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(ContractAddress)
        console.log(`Fund Balance: ${ethers.utils.formatEther(balance)}`)
    }
}

async function withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(ContractAddress, abi, signer)
        try {
            const txResponse = await contract.withdraw()
            await listenForTransactionMine(txResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}
