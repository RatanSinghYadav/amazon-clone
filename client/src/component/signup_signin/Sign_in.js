import React,{useState,useContext} from 'react';
import { NavLink } from 'react-router-dom';
import '../signup_signin/signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Logincontext } from '../context/Contextprovider';

function Sign_in() {
    const [logdata, setData] = useState(
        {
            email:'',
            password:''
        }
    )

    const { account, setAccount } = useContext(Logincontext);
    
    function adddata (e){
        const {name,value} = e.target;

        setData(()=>{
            return{
                ...logdata,
                [name]:value
            }
        })
    }

    const senddata = async (e) => {
        e.preventDefault();

        const { email, password} = logdata;
          
        // Extra validation
        

        try {
             if (email === ''){
                toast.warn("Email Provide 👎!", {
                    position: "top-center"
                });
            }else if (password === ''){
                toast.warn("Password Provide 👎!", {
                    position: "top-center"
                });
            }else{
                const res = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials:"include",
                body: JSON.stringify({
                    email,password
                })
            });

            const data = await res.json();
            // console.log(data);

            if (res.status === 422 || !data) {
                toast.error("Invalid Details 👎!", {
                    position: "top-center"
                });
            } else {
                setData({
                    ...logdata,email: "",password: ""
                });
                setAccount(data)
                toast.success("Login Successfully Done 😃!", {
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
                        <h1>Sign-In</h1>

                        <div className="form_data">
                            <label htmlFor="email">Email</label>
                            <input type='email' name='email' value={logdata.email} onChange={adddata} />
                        </div>
                        <div className="form_data">
                            <label htmlFor="password">Password</label>
                            <input type='password' name='password' value={logdata.password} onChange={adddata} placeholder="At least 6 characters" />
                        </div>
                        <button type="submit" className="signin_btn"onClick={senddata} >Continue</button>
                    </form>
                    <ToastContainer />
                </div>
                <div className="create_accountinfo">
                    <p>New to Amazon?</p>
                    <button>  <NavLink to="/signup">Create your Amazon Account</NavLink></button>
                </div>
            </div>
      
        </section>
    </div>
  )
}

export default Sign_in