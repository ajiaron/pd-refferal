import './App.scss';
import React, {useState, useEffect, useRef} from 'react';
import Carousel from './Carousel';
import InputForm from './InputForm';
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {motion, AnimatePresence} from 'framer-motion'
import axios from 'axios'
import Popup from './Popup';
import {v4 as uuidv4} from 'uuid'
import Confirmation from './Confirmation';

function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState(false)
  const [phone, setPhone] = useState("")
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
  // checks # of referrals after submitting a registered phone number
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
        registerUser(phone)
        setReferralCount(0)
      }
    } catch(e) {
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
        console.log(res.data)
      }
    } catch(e) {
        setStatus("error")
        console.log(e)
    }
  }

  const testSMS = async(phone) => {
    if (isRegistered) {
      setStatus("loading")
      try {
        const res = await axios.post(`${connection}/api/send-sms`, {phone:phone})
        if (res.data) {
          console.log(res.data)
          setStatus("success")
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
        duration:.6
      }
    }}>
  
      <div className='top-content-container'>
        <p className='top-content-text'>
          a peaking duck festival
        </p>
        <p className='top-content-header'>
            "snow house"
        </p>
      </div>
      <div className='main-content-container'>
        <InputForm 
          referralLink={referralLink}
          count={referralCount}
          isRegistered={isRegistered}
          onRegisterPhone={(val)=>checkRegistered(val)}
          onHandleSubmit={(phone)=>testSMS(phone)}
          onHandleClipboard={(type)=>handleClipboard(type)}
          onHandleNavigate={()=>handleNavigate()}
          onHandleTest={()=>handleTest()}
        />
      </div>
   
      <AnimatePresence>     
        {(shouldPopup && status.length > 0)&&  // gives request status
          <Popup status={status} onClose={()=>closePopup()}/>
        }
      </AnimatePresence>
    </motion.div>
  );
}

export default Home;