import React, { useContext, useEffect, useState } from 'react';
import './navbar.css';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Avatar from '@mui/material/Avatar';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logincontext } from '../context/Contextprovider';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Rightheader from './Rightheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from "react-redux";
import { url } from '../constant';
import { Drawer, IconButton, List, ListItem } from '@mui/material';

function Navbar() {
    const [text, setText] = useState("");
    const [liopen, setLiopen] = useState(true);

    // only for search
    const { products } = useSelector(state => state.getProductsdata);

    const getText = (items) => {
        setText(items)
        setLiopen(false)
    }
    


    //  profile drawer code
    const [anchorEl, setAnchorEl] = useState(null);




    // app drawer code

    const [open, setOpen] = useState(false);

    const [dropen, setDropen] = useState(false);

    const handleClick = (event) => {
        setOpen(event.currentTarget);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setOpen(false)
        setAnchorEl(null);
    };


    const { account, setAccount } = useContext(Logincontext);

    const getdetailsvaliduser = async () => {
        const res = await fetch(`${url}/validuser`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        // console.log(data);

        if (res.status !== 201) {
            console.log("first login");
        } else {
            // console.log("cart add ho gya hain");
            setAccount(data);
        }
    }

    useEffect(() => {
        getdetailsvaliduser();
    }, []);

    // for drawer

    const handelopen = () => {
        setDropen(true);
    }

    const handleClosedr = () => {
        setDropen(false)
    }



    // for logout
    const navigate = useNavigate()
    const logoutuser = async () => {
        const res2 = await fetch(`${url}/logout`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data2 = await res2.json();
        // console.log(data2);

        if (!res2.status === 201) {
            const error = new Error(res2.error);
            throw error;
        } else {
            setAccount(false);
            setOpen(false)
            toast.success("user Logout 😃!", {
                position: "top-center"
            });
            navigate("/");
        }
    }


    return (
        <div>
            <header>
                <nav>
                    <div className='left'>

                        <IconButton className='hamburgur' onClick={handelopen}>
                            <MenuIcon style={{ color: "#fff" }} />
                        </IconButton>

                        <Drawer open={dropen} onClose={handleClosedr}>
                            <Rightheader logclose={handleClosedr} logoutuser={logoutuser}/>
                        </Drawer>

                        <div className='navlogo'>
                            <NavLink to='/' ><img src='./amazon_PNG25.png' alt='' /></NavLink>
                        </div>
                        <div className='nav_searchbaar'>
                            <input type='text' name='' id=''
                                onChange={(e) => getText(e.target.value)}
                                placeholder="Search Your Products" />

                            <div className='search_icon'>
                                <SearchIcon id='search' />
                            </div>
                            {
                                text &&
                                <List className="extrasearch" hidden={liopen}>
                                    {
                                        products.filter(product => product.title.longTitle.toLowerCase().includes(text.toLowerCase())).map(product => (
                                            <ListItem>
                                                <NavLink to={`/getproductsone/${product.id}`} onClick={() => setLiopen(true)}>
                                                    {product.title.longTitle}
                                                </NavLink>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            }
                        </div>
                    </div>
                    <div className='right'>
                        {
                            account ?
                                ""
                                :
                                <div className='nav_btn'>
                                    <NavLink to='/login'>SignIn</NavLink>
                                </div>
                        }
                        <div className='cart_btn'>
                            {
                                account ?
                                    <NavLink to='/buynow'>
                                        <Badge badgeContent={account.carts.length} color="primary">
                                            <ShoppingCartIcon id='icon' />
                                        </Badge>
                                    </NavLink>
                                    :
                                    <NavLink to='/login'>
                                        <Badge badgeContent={0} color="primary">
                                            <ShoppingCartIcon id='icon' />
                                        </Badge>
                                    </NavLink>
                            }

                            <p>Cart</p>
                        </div>
                        {
                            account ?
                                <Avatar className='avtar2'
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >{account.fname[0].toUpperCase()}</Avatar>
                                :
                                <Avatar className='avtar'
                                    id="basic-button"
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                ></Avatar>
                        }

                        {
                            account ?
                                <>
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >

                                        <MenuItem onClick={handleClose} style={{ margin: 10 }}>My account</MenuItem>
                                        <MenuItem onClick={() => { handleClose(); logoutuser(); }} style={{ margin: 10 }} >
                                            <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} />   Logout
                                        </MenuItem>


                                    </Menu>
                                </>
                                : ""
                        }

                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Navbar;