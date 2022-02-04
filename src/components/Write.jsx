import {
  Typography,
  TextField,
  TextareaAutosize,
  Divider,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PDFViewer from "./PDFViewer";
import useStyles from "./styles/Write";
import WriteCopies from "./elements/WriteCopies";
import { ethers } from "ethers"
// import { stringify } from "draft-js/lib/DraftStringKey";
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'


import bookABI from '../contracts/book.sol/book.json'
import bookmarketABI from '../contracts/bookmarket.sol/bookmarket.json'

import { bookContractAddr, bookmarketContractAddr } from '../config'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


const Write = (props) => {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })

  const classes = useStyles();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

/*  function handleSubmit(event) {
    // const formData = new FormData();
    // formData.append("image", image);
    let coverImageHash = "Image.com" // need to fetch
    let descriptionHash = "description.com" //need to fetch
    let gold = 10
    let silver = 10
    let bronze = 10
    // event.target.elements.gold.value < 1 ? gold = 0 : gold = event.target.elements.gold.value
    // event.target.elements.silver.value < 1 ? silver = 0 : silver = event.target.elements.silver.value
    // event.target.elements.bronze.value < 1 ? bronze = 0 : bronze = event.target.elements.bronze.value

    const content = {
      tokenIds:[],
      tokenType : 0,
      contentType : 0,  //changed in book.sol
      publicationDate:Date.now,
      author:"props.userAccount",
      authorAddr: props.userAccount,
      ipfsHash: "event.target.elements.bookTitle.value",
      coverImageHash: coverImageHash, 
      onBid : false,
      descriptionHash : descriptionHash,
      Price : 500,
      isBurnt :false
    }
    console.log(content);
    let report = Mint(content, gold, silver, bronze)
    console.log(report);
   }

   async function Mint(content, gold, silver, bronze) {
      if (typeof window.ethereum !== 'undefined') {
        await props.ConnectWalletHandler()
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider })
        const signer = provider.getSigner()
        const contract = new ethers.Contract(props.bookContractAddr, props.bookABI, signer)
        const transaction = await contract.mintBatch("www.ipfhash.com", content, gold, silver, bronze)
        await transaction.wait()
        console.log(transaction)
    }
   }
*/
async function onChange(e) {
  console.log("event");
  const file = e.target.files[0]
  try {
    const added = await client.add(
      file,
      {
        progress: (prog) => console.log(`received: ${prog}`)
      }
    )
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    console.log(url);
    setFileUrl(url)
  } catch (error) {
    console.log('Error uploading file: ', error)
  }  
}
async function createMarket() {
  const { name, description, price } = formInput
  console.log("market");
  console.log(name, description, price, fileUrl);
  if (!name || !description || !price || !fileUrl) return
  /* first, upload to IPFS */
  const data = JSON.stringify({
    name, description, image: fileUrl
  })
  console.log(data);
  try {
    const added = await client.add(data)
    console.log(added);
    const url = `https://ipfs.infura.io/ipfs/${added.path}`
    console.log(url);
    /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
    createSale(url)
  } catch (error) {
    console.log('Error uploading file: ', error)
  }  
}

async function createSale(url) {
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)    
  const signer = provider.getSigner()
  const addr = await signer.getAddress()
  const content = {
    tokenIds:[],
    tokenType : 0,
    contentType : 0,
    publicationDate:1225666,
    author:"Ranju GC",
    authorAddr: addr,
    ipfsHash: "thank you",
    coverImageHash: "coverImage",
    onBid : false,
    descriptionHash : "descriptionHash",
    Price : 400,
    isBurnt :false
  }
  
  /* next, create the item */
  let contract = new ethers.Contract(bookContractAddr, bookABI.abi, signer)
  let transaction = await contract.mintOneToken(url, content)
  let tx = await transaction.wait()
  console.log(tx);
  let event = tx.events[0]
  console.log(event);
  let value = event.args[2]
  let tokenId = value.toNumber()
  console.log(tokenId);

  const price = ethers.utils.parseUnits(formInput.price, 'ether')

  /* then list the item for sale on the marketplace */
  contract = new ethers.Contract(bookmarketContractAddr, bookmarketABI.abi, signer)
  let listingPrice = await contract.getListingPrice()
  console.log(listingPrice);
  listingPrice = listingPrice.toString()

  transaction = await contract.createMarketItem(bookContractAddr, tokenId, price, { value: listingPrice })
  await transaction.wait()
  // router.push('/')
}


  return (

    <div className={classes.writePageContent}>
      <Typography>Upload Book</Typography>
      <div className={classes.uploadContent}>
          <div className={classes.formContent}> 
            <div className={classes.textFields}>
            <Typography
                style={{
                  margin: "10px 0px 0px 10px",
                  fontSize: "1.5rem",
                  color: '#C9B037',
                }}>
                Title
              </Typography>
              <TextField
                id='bookTitle'
                label="Book's Title"
                variant='outlined'
                className={classes.textField}
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
              />
              <Typography
                style={{
                  margin: "10px 0px 0px 10px",
                  fontSize: "1.5rem",
                  color: '#C9B037',
                }}>
                Price
              </Typography>
              <TextField
                id='number'
                label='Price'
                variant='outlined'
                type='number'
                className={classes.textField}
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
              />
              <Typography
                style={{
                  margin: "10px 0px 0px 10px",
                  fontSize: "1rem",
                }}>
                Book Description
              </Typography>
              <TextareaAutosize
                id='description'
                aria-label='Description'
                minRows={10}
                placeholder='A short description about your book'
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
              />
            </div>
            <div>
              <Typography
                style={{
                  margin: "80px 150px 0px 0px",
                  fontSize: "2rem",
                }}>
                Upload Book Cover
              </Typography>
              <div className={classes.chooseFile}>
                CHOOSE FILE
                <input
                  type="file"
                  name="Asset"
                  // className="my-4"
                  onChange={onChange}
                  className={classes.inputFile}
                />
                {
                  fileUrl && (
                    <img  width="3" src={fileUrl} />
                  )
                }
              </div>
              <img src={preview} alt='' className={classes.uploadedImage}/>
              <button
                type='submit'
                onClick={createMarket}
                className={`${classes.submitButton} ${classes.chooseFile}`}
              >
                Mint
              </button>
             </div>
          </div>
        {/* </form> */}
        {/* <Divider style={{ margin: "15px 0px", backgroundColor: "#fff" }} />
        <PDFViewer /> */}
      </div>
    // </div>
  );
};

export default Write;
