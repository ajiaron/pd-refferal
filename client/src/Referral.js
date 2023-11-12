import './App.scss';
import React, {useState, useEffect, useRef} from 'react';
import Carousel from './Carousel';
import InputForm from './InputForm';
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {motion, AnimatePresence} from 'framer-motion'
import axios from 'axios'
import {BiLink} from 'react-icons/bi'
import Popup from './Popup';
import {v4 as uuidv4} from 'uuid'

function Referral() {
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState(false)
  const [phone, setPhone] = useState("")
  const [ownerPhone, setOwnerPhone] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [shouldPopup, setShouldPopup] = useState(false)
  const [referralLink, setReferralLink] = useState("")
  const [isApproved, setIsApproved] = useState(false)
  const [accessLink, setAccessLink] = useState("")
  const [referralCount, setReferralCount] = useState(0)
  const env = process.env.REACT_APP_ENV
  const connection = process.env.REACT_APP_API_URL
  function closePopup() {
    setShouldPopup(false)
    setStatus('')
  }
  function handleTest() {
  }
  function handleNavigate() {
    if (isRegistered) {
      if (referralCount >= 2) {
        navigate(`/access`, {state: {token:uuidv4()}})
      } else {
        setStatus("unfulfilled")
      }
    } else {
      setStatus("unregistered")
    }
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

  const checkApproved = async(phone) => {
    try {
      const res = await axios.get(`${connection}/api/getapproved`, {
        params:{
          phone:phone
      }})
      if (res.data) {
        setIsApproved(res.data[0].approved)
        if (res.data[0].approved === 0) {
  // after submitting a phone # with 2 referrals, send a code if theyre not already approved
          sendSMS(phone)
        }
      } else {  
        console.log("not approved yet")
      }
    } catch(e) {
      console.log(e)
    //  setStatus("error")
    }
  }
  const confirmCode = async(phone, code) => {

      if (isRegistered) {
        if (referralCount >= 2) {

          setStatus("loading")
          try {

            const res = await axios.get(`${connection}/api/confirmcode`, {
              params:{
                phone:phone,
                code:code
              }
            })
            if (res.data && res.data[0].valid) {
              setIsApproved(true)
              handleNavigate()
            } else {

              // just in case the user presses back
              const res = await axios.get(`${connection}/api/getapproved`, {
                params:{
                  phone:phone
              }})
              if (res.data && res.data[0].approved) {
                handleNavigate()
              } else {
                setStatus("invalid_code")
              }
              // end of bypass
        
            }
          } catch(e) {
            console.log(e)
            setStatus("error")
          }
        } else {
          setStatus("unfulfilled")
        }
      } else {
        setStatus("unregistered")
      }
    
  }


  const checkReferralCount = async(phone) => {
    try {
        const res = await axios.get(`${connection}/api/getreferralcount`,
        {params:{
            phone:phone
        }})
        if (res.data) {
            setReferralCount(res.data[0].count)
            if (res.data[0].count >= 2) {
              checkApproved(phone)
            }
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
     //   checkApproved(phone)
        // change this to actual name of site when done
        setReferralLink((env === "development")?
        `http://localhost:3000/referral?token=${res.data[0].referral}`:
        `https://peakingduck-referral.netlify.app/referral?token=${res.data[0].referral}`)
      } else {
        // increment referral count for link owner here, before registering new user
        incrementReferral(phone)
        registerUser(phone)
        setReferralCount(0)
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
            `https://peakingduck-referral.netlify.app/referral?token=${res.data.referral}`)
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
    let phone = ''
    try {
        const res = await axios.get(`${connection}/api/checkreferral`, {
        params:{
          referralToken:token
        }})
        if (res.data && res.data[0].isValid) {
            validated = res.data[0].isValid
            phone = res.data[0].phone
        } 
      } catch(e) {
        console.log(e)
        return false
      }
      callback(validated, phone)
      return validated
};

const sendSMS = async(phone) => {
  if (isRegistered) {
    setStatus("loading")
    try {
      const res = await axios.post(`${connection}/api/send-sms`, {phone:phone})
      if (res.data) {
        console.log(res.data)
        setStatus("code_sent")
      } else {
        console.log("sms failed")
        setStatus("error")
      }
    } catch(e) {
      console.log(e)
      setStatus("error")
    }
  } else {
    setStatus("unregistered")
  }
}

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
    tokenIsValid = validateReferral(token, (valid, phone) => {
        setIsValid(valid)
        setIsLoading(false)
        setOwnerPhone(phone)
    });
    setIsValid(tokenIsValid)
    console.log(location)
  }, []) 
  return (
    <motion.div className="main-content"
    initial={{x:0}} 
    animate={{x:0}} 
    transition={{
        type: "spring",
        stiffness:160,
        damping:40,
        duration:.5,
      }}
    exit={{x:-window.innerWidth, opacity:0,
    transition:{
        type: "tween",
        duration:.6,
     }
    }}>
      <div className='top-content-container'>
        <p className='top-content-text'>
          a peaking duck festival
        </p>
        <p className='top-content-header'>
            "snow house"
        </p>
        <p className='top-content-subtext'>
            Get access to your discounted tickets below!
        </p>
      </div>
      <div className='main-content-container'>
        <InputForm 
          referralLink={referralLink}
          count={referralCount}
          isRegistered={isRegistered}
          onRegisterPhone={(val)=>checkRegistered(val)}
          onHandleSubmit={(phone)=>sendSMS(phone)}
          onHandleClipboard={(type)=>handleClipboard(type)}
          onHandleNavigate={()=>handleNavigate()}
          onHandleTest={()=>handleTest()}
          onConfirmCode={(phone, code)=> confirmCode(phone, code)}
        />
      </div>

      <span className="referral-indicator"
      onClick={()=>setShowLink(!showLink)}>
        <BiLink className='link-icon'/>
        <AnimatePresence>
          {(ownerPhone.length>0)&&
        <motion.div
        initial={{width:0, x:12}}
        animate={{width:(showLink)?"auto":0, x:(showLink)?-2:12}}
        transition={{
          type: "spring",
          stiffness: 160,
          damping: 30,
    //      delay:.5,
          duration:.25
        }}
        exit={{width:0, x:12, 
        transition:{
          type: "spring",
          stiffness: 160,
          damping: 30,
        //  delay:.5,
          duration:.25
        }}}
        className="link-text">
         &nbsp;+1&nbsp;{`${ownerPhone.substring(0,3)}-${ownerPhone.substring(3,6)}-${ownerPhone.substring(6,10)}`}
        </motion.div>
        }
        </AnimatePresence>
       
      </span>
   
      <AnimatePresence>     
        {(shouldPopup && status.length > 0)&&  // gives request status
          <Popup status={status} onClose={()=>closePopup()}/>
        }
      </AnimatePresence>
    </motion.div>
  );
}

export default Referral;