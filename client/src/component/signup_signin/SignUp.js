import React,{useState} from 'react';
import '../signup_signin/signup.css';
import { NavLink } from 'react-router-dom';
import { Divider } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
    const [udata, setUdata] = useState({
        fname:'',
        email:'',
        mobile:'',
        password:'',
        cpassword:''
    });

    function adddata(e){
        const {name,value} = e.target;
        setUdata(()=>{
            return{
                ...udata,
                [name]:value
            }
        })
    }

    const senddata = async (e) => {
        e.preventDefault();

        const { fname, email, mobile, password, cpassword } = udata;
          
        // Extra validation
        

        try {
            if(fname === ''){
                toast.warn("Your Name Provide 👎!", {
                    position: "top-center"
                });
            }else if (email === ''){
                toast.warn("Email Provide 👎!", {
                    position: "top-center"
                });
            }else if (mobile === ''){
                toast.warn("Mobile Number Provide 👎!", {
                    position: "top-center"
                });
            }else if (password === ''){
                toast.warn("Password Provide 👎!", {
                    position: "top-center"
                });
            }else if (cpassword === ''){
                toast.warn("Confirm Password Provide 👎!", {
                    position: "top-center"
                });
            }else{
                const res = await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fname, email, mobile, password, cpassword
                })
            });

            const data = await res.json();
            console.log(data);

            if (res.status === 422 || !data) {
                toast.error("Invalid Details 👎!", {
                    position: "top-center"
                });
            } else {
                setUdata({
                    ...udata, fname: "", email: "",
                    mobile: "", password: "", cpassword: ""
                });
                toast.success("Registration Successfully Done 😃!", {
                    position: "top-center"
                });
            }

            }       
        } catch (error) {
            console.log("front end ka catch error hai" + error.message);
        }
    }




  return (
    <div>
        <section>
            <div className="sign_container">
                <div className="sign_header">
                    <img src="./blacklogoamazon.png" alt="signupimg" />
                </div>
                <div className="sign_form">
                    <form method="POST">
                        <h1>Create account</h1>
                        <div className="form_data">
                            <label htmlFor="name">Your name</label>
                            <input type='fname' name='fname' value={udata.fname} onChange={adddata} id='fname' />
                        </div>
                        <div className="form_data">
                            <label htmlFor="email">email</label>
                            <input input type='email' name='email' value={udata.email} onChange={adddata} id='email' />
                        </div>
                        <div className="form_data">
                            <label htmlFor="mobile">Mobile number</label>
                            <input input type='mobile' name='mobile' value={udata.mobile} onChange={adddata} id='mobile' />
                        </div>
                        <div className="form_data">
                            <label htmlFor="password">Password</label>
                            <input input type='password' name='password' value={udata.password} onChange={adddata} id='password'  placeholder="At least 6 characters" />
                        </div>
                        <div className="form_data">
                            <label htmlFor="password">Password again</label>
                            <input input type='cpassword' name='cpassword' value={udata.cpassword} onChange={adddata} id='cpassword' />
                        </div>
                        <button type="submit" className="signin_btn" onClick={senddata}>Continue</button>

                        <Divider />

                        <div className="signin_info">
                            <p>Already have an account?</p>
                            <NavLink to="/login">Sign in</NavLink>
                        </div>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </section>
    </div>
  )
}

export default SignUp