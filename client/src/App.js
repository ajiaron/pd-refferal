import './App.scss';
import React, {useState, useEffect, useRef} from 'react';
import AnimatedRoutes from "./AnimatedRoutes"
import { BrowserRouter as Router } from "react-router-dom";

export default function App() {
  return (
    <>
    <Router>
      <AnimatedRoutes />
    </Router>
    </>
  )
}