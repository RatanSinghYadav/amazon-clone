import { Divider } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../cart/cart.css';
import { Logincontext } from '../context/Contextprovider';
import CircularProgress from '@mui/material/CircularProgress';
import { url } from '../constant';

function Cart() {
    const [inddata, setIndedata] = useState("");

    const { id } = useParams("");

    const navigate = useNavigate();

    const {account,setAccount} = useContext(Logincontext)

    const getinddata = async () => {
        const res = await fetch(`${url}/getproductsone/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
        });

        const data = await res.json();

        if (res.status !== 201) {
            alert("no data available")
        } else {
            setIndedata(data);
        }
    };



    useEffect(() => {
        setTimeout(getinddata, 1000)
    }, [id]);

    // add to cart function

    const addtocart = async (id) => {
        const checkres = await fetch(`${url}/addcart/${id}`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inddata
            }),
            credentials: "include"
        })
        const data1 = await checkres.json();
        console.log(data1);

        if (checkres.status === 401 || !data1) {
            console.log("user invalid");
            alert("user invalid");

        } else {
            // alert("data added in your cart");
            navigate('/buynow');
            setAccount(data1);
        }
    }
 
    function loginFirst(){
        navigate('/login');
    }


    return (

        <div className="cart_section">

            {inddata && Object.keys(inddata).length &&
                <div className="cart_container">
                    <div className="left_cart">
                        <img src={inddata.url} alt="cart" />
                        <div className="cart_btn">
                            <button className="cart_btn1" onClick={account?() => addtocart(inddata.id):loginFirst} >Add to Cart</button>
                            <button className="cart_btn2">Buy Now</button>
                        </div>

                    </div>
                    <div className="right_cart">
                        <h3>{inddata.title.shortTitle}</h3>
                        <h4>{inddata.title.longTitle}</h4>
                        <Divider />
                        <p className="mrp">M.R.P. : <del>₹{inddata.price.mrp}</del></p>
                        <p>Deal of the Day : <span style={{ color: "#B12704" }}>₹{inddata.price.cost}.00</span></p>
                        <p>You save : <span style={{ color: "#B12704" }}> ₹{inddata.price.mrp - inddata.price.cost} ({inddata.price.discount}) </span></p>

                        <div className="discount_box">
                            <h5 >Discount : <span s tyle={{ color: "#111" }}>{inddata.discount}</span> </h5>
                            <h4>FREE Delivery : <span style={{ color: "#111", fontWeight: "600" }}>Oct 8 - 21</span> Details</h4>
                            <p style={{ color: "#111" }}>Fastest delivery: <span style={{ color: "#111", fontWeight: "600" }}> Tomorrow 11AM</span></p>
                        </div>
                        <p className="description">About the Iteam : <span style={{ color: "#565959", fontSize: "14px", fontWeight: "500", letterSpacing: "0.4px" }}>{inddata.description}</span></p>
                    </div>
                </div>
            }
            {!inddata ? <div className="circle">
                <CircularProgress />
                <h2> Loading....</h2>
            </div> : ""}

        </div>
    )
}

export default Cart