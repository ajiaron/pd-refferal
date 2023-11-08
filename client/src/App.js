import './App.scss';
import React, {useState, useEffect, useRef} from 'react';
import Carousel from './Carousel';
import InputForm from './InputForm';
import {motion, AnimatePresence} from 'framer-motion'
import axios from 'axios'
import Popup from './Popup';
function App() {
  const [status, setStatus] = useState(false)
  const [phone, setPhone] = useState("")
  const [shouldPopup, setShouldPopup] = useState(false)
  const [referralLink, setReferralLink] = useState("")
  const [accessLink, setAccessLink] = useState("")
  const connection = process.env.REACT_APP_API_URL
  function closePopup() {
    setShouldPopup(false)
    setStatus('')
  }
  function handleForm(data) {
    setPhone(data)
  }
  function handleClipboard(type) {
    if (type === "referral") {
        navigator.clipboard.writeText(`${referralLink}`)
    } else {
        navigator.clipboard.writeText(`https://peakingduckgroup.com/${accessLink}`)
    }
    setStatus("copied")
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
        setReferralLink(`https://snowhouse.com/${res.data[0].referral}`)
      } else {
        registerUser(phone)
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
        setReferralLink(`https://snowhouse.com/${res.data.referral}`)
        setStatus("success")
        console.log(res.data)
      }
    } catch(e) {
        setStatus("error")
        console.log(e)
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
    <div className="main-content">
      <Carousel/>
      <div className='main-content-container'>
        <InputForm 
        referralLink={referralLink}
        onRegisterPhone={(val)=>checkRegistered(val)}
        onHandleSubmit={(data)=>handleForm(data)}
        onHandleClipboard={(type)=>handleClipboard(type)}/>
      </div>
      <AnimatePresence>     
          {(shouldPopup && status.length > 0)&&  // gives request status
            <Popup status={status} onClose={()=>closePopup()}/>
          }
        </AnimatePresence>
    </div>
  );
}

export default App;
