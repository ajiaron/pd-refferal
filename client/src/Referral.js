import './App.scss';
import React, {useState, useEffect, useRef} from 'react';
import Carousel from './Carousel';
import InputForm from './InputForm';
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {motion, AnimatePresence} from 'framer-motion'
import axios from 'axios'
import Popup from './Popup';

function Referral() {
  const location = useLocation()
  const [status, setStatus] = useState(false)
  const [phone, setPhone] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [shouldPopup, setShouldPopup] = useState(false)
  const [referralLink, setReferralLink] = useState("")
  const [accessLink, setAccessLink] = useState("")
  const [referralCount, setReferralCount] = useState(0)
  const env = process.env.REACT_APP_ENV
  const connection = process.env.REACT_APP_API_URL
  function closePopup() {
    setShouldPopup(false)
    setStatus('')
  }
  function handleForm(data) {
    setPhone(data)
  }
  function handleTest() {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    console.log(token)
  }
  function handleClipboard(type) {
    if (type === "referral") {
        navigator.clipboard.writeText(`${referralLink}`)
    } else {
        navigator.clipboard.writeText(`https://peakingduckgroup.com/${accessLink}`)
    }
    setStatus("copied")
  }
  const checkReferralCount = async(phone) => {
    try {
        const res = await axios.get(`${connection}/api/getreferralcount`,
        {params:{
            phone:phone
        }})
        if (res.data) {
            setReferralCount(res.data[0].count)
        } else {
            console.log("couldnt find user")
        }
    } catch(e) {
        console.log(e)
    }
  }
  // call this when async storage is implemented on startup 
  const checkRegistered = async(phone) => {
    setStatus("loading")
    try {
      const res = await axios.get(`${connection}/api/checkexists`, {params:{
        phone:phone
      }})
      if (res.data && res.data[0].referral) {
        setStatus("registered")
        setIsRegistered(true)
        checkReferralCount(phone)
        // change this to actual name of site when done
        setReferralLink((env === "development")?
        `http://localhost:3000/referral?token=${res.data[0].referral}`:
        `https://peakingduck-referral.netlify.app/referral?token=${res.data[0].referral}`)
      } else {
        // increment referral count for link owner here, before registering new user
        incrementReferral(phone)
        registerUser(phone)
      }
    } catch(e) {
      setStatus("error")
      console.log(e)
    }

  }
  const incrementReferral = async(phone) => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token'); 
    try {
        const res = await axios.post(`${connection}/api/countreferral`,
        {referral:token, recipientPhone:phone})
        if (res.data) {
            console.log("owner link:", res.data)
        } else {
            console.log("failed to increment referral")
        }
    } catch (e) {
        setStatus("error")
        console.log(e)
    }
  }
  const registerUser = async(phone) => {
    console.log('phone', phone)
    //setStatus("loading")
    try {
      const res = await axios.post(`${connection}/api/createuser`,
      {phone:phone})
      if (res.data) {
        setReferralLink((env === "development")?
            `http://localhost:3000/referral?token=${res.data.referral}`:
            `https://peakingduck-referral.nerlify.app/referral?token=${res.data.referral}`)
        setStatus("success")
        setIsRegistered(true)
        console.log("new link:",res.data)
      }
    } catch(e) {
        setStatus("error")
        console.log(e)
    }
  }

  const validateReferral = async(token, callback) => {
    const connection = process.env.REACT_APP_API_URL
    let validated = false;
    try {
        const res = await axios.get(`${connection}/api/checkreferral`, {
        params:{
          referralToken:token
        }})
        if (res.data && res.data[0].isValid) {
            validated = res.data[0].isValid
        } 
      } catch(e) {
        console.log(e)
        return false
      }
      callback(validated)
      return validated
};

  useEffect(()=> {  // for loading status bar
    if (status.length>0) {
      setShouldPopup(true)
      if (status!=='loading') {
        setTimeout(() => {
          setShouldPopup(false)
          setStatus('')
        }, 3000);
      }
    }
  }, [status])
  useEffect(()=> {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token'); 
    let tokenIsValid = false;
    tokenIsValid = validateReferral(token, (valid) => {
        setIsValid(valid)
        setIsLoading(false)
    });
    setIsValid(tokenIsValid)
    console.log(location)
  }, []) 
  return (
    <div className="main-content">
      <Carousel/>
      <div className='main-content-container'>
        <InputForm 
          referralLink={referralLink}
          count={referralCount}
          isRegistered={isRegistered}
          onRegisterPhone={(val)=>checkRegistered(val)}
          onHandleSubmit={(data)=>handleForm(data)}
          onHandleClipboard={(type)=>handleClipboard(type)}
        />
      </div>
   
      <AnimatePresence>     
        {(shouldPopup && status.length > 0)&&  // gives request status
          <Popup status={status} onClose={()=>closePopup()}/>
        }
      </AnimatePresence>
    </div>
  );
}

export default Referral;