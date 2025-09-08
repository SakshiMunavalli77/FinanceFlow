import React from "react";
import "./styles.css";
import  { useState } from 'react';
import Input from "../Input";
import Button from '../Button'; // Adjust the path based on your folder structure
import { createUserWithEmailAndPassword 
    ,signInWithEmailAndPassword} from "firebase/auth";
import { toast } from "react-toastify";
import { auth ,db} from "../../pages/firebase"; 
//import { doc }from "../../pages/firebase"; 
import { useNavigate } from "react-router-dom";
import { doc,setDoc ,getDoc} from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSigninComponent(){
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[confirmPassword,setConfirmPassword]=useState("");
    const[loginForm, setLoginForm]=useState(false);
    const[loading, setLoading]=useState(false);
    const navigate=useNavigate();
    const provider = new GoogleAuthProvider();

    function signupWithEmail(){
        setLoading(true);
        console.log("Name",name);
        console.log("email",email);
        console.log("password",password);
        console.log("confirmpassword",confirmPassword);
        if(name!="" && email!="" && password!="" && confirmPassword!=""){
            if(password==confirmPassword){
            createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log("User>>>",user);
    toast.success("User Created!");
    setLoading(false);
    setName("");
    setPassword("");
    setEmail("");
    setConfirmPassword("");
    createDoc(user);
    navigate("/dashboard");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage);
    setLoading(false);
    // ..
  });
        }else{
            toast.error("Password and Confirm Password don't match!");
            setLoading(false);
        }
    }else{
        toast.error("Password and Confirm Password don't match!");
        setLoading(false);
    }
}
function loginUsingEmail() {
  console.log("Email",email);
  console.log("Password",password);
  setLoading(true);
  if( email!="" && password!=""){
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    toast.success("User Logged In Successfully!");
    console.log("User Logged in",user);
      setLoading(false);
    navigate("/dashboard");
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setLoading(false);
    toast.error(errorMessage);
    // ..
  });
  }else{
    toast.error("All feilds are mandatory");
    setLoading(false);
  }
}

async function createDoc(user){
    setLoading(true);
    if(!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData= await getDoc(userRef);
    if(!userData.exists()){
    try{
        await setDoc(doc(db,"users",user.uid),{
        name: user.displayName ? user.displayName : name,
        email: user.email,
        photoURL: user.photoURL ? user.photoURL : "",
        createdAt: new Date(),
    });
    toast.success("Doc created!");
    setLoading(false);
    }
    catch(e){
        toast.error(e.message);
        setLoading(false);
    }
}else{
    toast.error("Doc already exists!");
    setLoading(false);
}
}
function googleAuth() {
  setLoading(true);
  
  // Force user to select account
  provider.setCustomParameters({
    prompt: "select_account"
  });

  try {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("user>>>", user);
        createDoc(user);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User authenticated");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  } catch (e) {
    setLoading(false);
    toast.error(e.message);
  }
}

    return (
        <>
        {loginForm ? (
    <div className="signup-wrapper">
    <h2 className="title">
        Login on <span style={{ color: "var(--theme)"}}>FinanceFlow</span></h2>
        <form>
            
             <Input
             type="email"
             label={"Email"} 
             state={email} 
             setState={setEmail} 
             placeholder={"JohnDoe@gmail.com"}/>
             <Input
             type="password"
             label={"Password"} 
             state={password} 
             setState={setPassword} 
             placeholder={"JohnDoe@77"}/>
             <Button
             disabled={loading}
             text={loading ? "Loading.." : "Login Using Email and Password"}
             onClick={loginUsingEmail}/>
             
             <p className="p-login">or</p>
             <Button 
             onClick={googleAuth}
             text= {"Login using Google"} blue={true}/>
             <p className="p-login" style={{cursor:"pointer"}}
              onClick={()=>setLoginForm(!loginForm)}>
                Or Don't Have An Account ? Click Here </p>
        </form>
        </div>
    ) : (
    <div className="signup-wrapper">
    <h2 className="title">
        Sign Up on <span style={{ color: "var(--theme)"}}>FinanceFlow</span></h2>
        <form>
            <Input
             label={"Full Name"} 
             state={name} 
             setState={setName} 
             placeholder={"John Doe"}/>
             <Input
             type="email"
             label={"Email"} 
             state={email} 
             setState={setEmail} 
             placeholder={"JohnDoe@gmail.com"}/>
             <Input
             type="password"
             label={"Password"} 
             state={password} 
             setState={setPassword} 
             placeholder={"JohnDoe@77"}/>
             <Input
             type="password"
             label={"ConfirmPassword"} 
             state={confirmPassword} 
             setState={setConfirmPassword} 
             placeholder={"JohnDoe@77"}/>
             <Button text= {"Signup using Email and Password"}onClick={signupWithEmail}/>
             <p className="p-login">or</p>
             <Button
              onClick={googleAuth}
             text= {"Signup using Google"} blue={true}/>
             <p className="p-login" 
             style={{cursor:"pointer"}}
              onClick={()=>setLoginForm(!loginForm)}>Or Have An Account Already? Click Here </p>
        </form>
    </div>
    )}
    </>
    );
}

export default SignupSigninComponent;