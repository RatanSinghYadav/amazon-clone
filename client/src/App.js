import './App.css';
import Footer from './component/footer/Footer';
import Navbar from './component/header/navbar';
import Maincomp from './component/home/Maincomp';
import Newnav from './component/newnavbaar/Newnav';
import { Routes, Route } from "react-router-dom";
import Sign_in from './component/signup_signin/Sign_in';
import SignUp from './component/signup_signin/SignUp';
import Cart from './component/cart/Cart.js';
import Buynow from './component/buynow/Buynow';
import { useEffect,useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoader(true)
    }, 2000);
  },[]) 

  return (
    < >
      {
        loader ?
          <>
            <Navbar />
            <Newnav />
            <Routes>
              <Route path='/' element={<Maincomp />} />
              <Route path='/login' element={<Sign_in />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/getproductsone/:id' element={<Cart />} />
              <Route path='/buynow' element={<Buynow />} />
            </Routes>
            <Footer />
          </>
          :
          
          <div className='circle' >
          <CircularProgress />
            <h2>Loading...</h2>
          </div>
      }
    </>
  );
}

export default App;
