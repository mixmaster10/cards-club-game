import React, {useRef, useEffect, useState} from 'react';
import "./SignIn.css";
import Logo from "../assets/First_log.png";
import { useEthers } from "@usedapp/core";
import { useNavigate } from 'react-router-dom';

const SignIn = ({socket}) => {
    const unmounted = useRef(true);
    const { activateBrowserWallet, account, chainId } = useEthers();
    const [connectClicked, setConnectClicked] = useState(false);
    const navigate = useNavigate();

    function handleConnectWallet(){
        activateBrowserWallet();
        setConnectClicked(true);
    }

    useEffect( () => {
        if(account && connectClicked && (chainId == 56 || chainId == 1)){
            socket.emit("addUser", {
                wallet: account
            })
            navigate('/home', {replace: true})
        }

        return () => { unmounted.current = false }
    }, [account, connectClicked]);

    return (
        <div className="SignIn">
            <div className="SignIn-logo-area">
                <div className="SignIn-logo">
                    <img src={Logo} alt="logo" />
                </div>
                <div className="SignIn-logo-btn">
                    <button onClick={ handleConnectWallet }><span>Connect Wallet</span></button>
                </div>
            </div>
        </div>
    )
}

export default SignIn
