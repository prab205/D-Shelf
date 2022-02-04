import Header from '../components/Header';
import React, { useState, useEffect } from "react";
import "../App.css"
import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import Write from '../components/Write';
import MarketPlace from '../components/MarketPlace';
import Collections from '../components/Collections';
import SinglePage from '../components/SinglePage';
import {ethers} from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import bookABI from '../contracts/book.sol/book.json'
import bookmarketABI from '../contracts/bookmarket.sol/bookmarket.json'

import { bookContractAddr, bookmarketContractAddr } from '../config'

function App() {

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState('Connect Wallet');
  const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  
  const ConnectWalletHandler = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      // set ethers provider
      setProvider(new ethers.providers.Web3Provider(window.ethereum));

      // connect to metamask
      window.ethereum.request({ method: 'eth_requestAccounts'})
      .then(result => {
        setConnButtonText('Wallet Connected');
        accountChangedHandler(result[0]);
      })
      .catch(error => {
        setErrorMessage(error.message);
      });

    } else {
      console.log('Need to install MetaMask');
      setErrorMessage('Please install MetaMask browser extension to interact');
    }
  }

  // update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(bookContractAddr, bookABI, tempSigner);
		setContract(tempContract);	
	}



  const getUserCollections=()=>{
  }

  useEffect(() => {
    if(defaultAccount){
    provider.getBalance(defaultAccount)
    .then(balanceResult => {
      setUserBalance(ethers.utils.formatEther(balanceResult));
    })
    };
  }, [defaultAccount]);
  
  return (
    <div className="App">
      <Header 
        userAccount={defaultAccount}
        userBalance = {userBalance}
        ConnectWalletHandler = {ConnectWalletHandler}
        errorMessage = {errorMessage}
        connButtonText = {connButtonText}
      />
      <Routes>
        <Route exact path="/" element={<Home 
        Contract = {contract}
        />}>
        </Route>
        <Route path="/MarketPlace" element={<MarketPlace
        Contract = {contract}
        />}>

        </Route>
        <Route path="/myCollections" element={<Collections
        Contract = {contract}
        />}>

        </Route>
        <Route exact path="/write" element={<Write
        Contract = {contract} 
        />}>

        </Route>
        <Route exact path="/singlePage" element={<SinglePage
        Contract = {contract} 
        />}>

        </Route>
      </Routes>
    </div>
  );
}

export default App;
