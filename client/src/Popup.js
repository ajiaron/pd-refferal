import React, { useState, useEffect, useRef } from 'react'
import "./Popup.scss"
import { motion } from "framer-motion";
import {BsCheckLg} from 'react-icons/bs'
import {BiTimeFive} from 'react-icons/bi'
import { LiaTimesSolid,LiaHourglass } from 'react-icons/lia'

export default function Popup ({ status, onClose }) {
    return (
          <motion.div
              className="popup-container"
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              exit= {{ opacity:0 }}
              transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
          }}
      >
          <div className={`popup-wrapper ${status==="copied"||status==="registered"||status==="code_sent"?"success":(status==="unfulfilled"||status==="unregistered")?"loading":
          (status==="invalid_code")?"error":
          status}-wrapper`}>
            <div className="popup-text-container">
                <p className={"popup-text"}>
                    {(status==="success")?'Response successfully received.':
                    (status==="loading")?"Processing request...":
                    (status==="copied")?"Copied to clipboard.":
                    (status==="registered")?"Contact already registered.":
                    (status==="unfulfilled")?"Need at least 2 referrals!":
                    (status==="unregistered")?"Please register your phone number.":
                    (status==="invalid_code")?"Incorrect verification code.":
                    (status==="code_sent")?"Confirmation code sent.":
                    "An error occured."}
                </p>
            </div>
            <span className='exit-icon-container' onClick={()=>onClose()}>
                {(status==='success'|| status==="copied" || status==="registered"|| status==="code_sent")?
                <BsCheckLg className='exit-icon'/>:
                (status==='loading')?
                <BiTimeFive className='exit-icon'/>:
                <LiaTimesSolid className='exit-icon'/>
                }
            </span>
          </div>
      </motion.div>
    )
  }