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

const client = ipfsHttpClient('https://ipfs.infura.io.5001/api/v0')

const Write = (props) => {

  // const [fileUrl setFileUrl ] = use
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

  function handleSubmit(event) {
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

  return (
    <div className={classes.writePageContent}>
      <Typography>Upload Book</Typography>
      <div className={classes.uploadContent}>
        <form
          onSubmit = {handleSubmit}
          noValidate
          autoComplete='off'
          className={classes.writerForm}>
          {/* <div className={classes.formContent}> */}
            {/* <div className={classes.textFields}>
              <TextField
                id='bookTitle'
                name='bookTitle'
                label="Book's Title"
                variant='outlined'
                className={classes.textField}
                required
              />
              <WriteCopies name='gold' title='Gold' color='#C9B037' required/>
              <WriteCopies name='silver' title='Silver' color='#B4B4B4' required/>
              <WriteCopies name='bronze' title='Bronze' color='#AD8A56' required/>
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
                required
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
                  type='file'
                  accept='image/*'
                  required
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if (file && file.type.substring(0, 5) === "image") {
                      setImage(file);
                    } else {
                      setImage(null);
                    }
                  }}
                  className={classes.inputFile}
                  required
                />
              </div>
              <img src={preview} alt='' className={classes.uploadedImage}/> */}
              <button
                type='submit'
                className={`${classes.submitButton} ${classes.chooseFile}`}
              >
                Mint
              </button>
            {/* </div>
          </div> */}
        </form>
        <Divider style={{ margin: "15px 0px", backgroundColor: "#fff" }} />
        <PDFViewer />
      </div>
    </div>
  );
};

export default Write;
