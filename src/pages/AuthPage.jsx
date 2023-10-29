import { 
    signInWithPopup,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    sendPasswordResetEmail} from 'firebase/auth';

import {auth,provider} from './../firebase/config'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


const AuthPage = () => {
    const navigate =useNavigate()
    const [signUp,setSignUp] =useState()
    const[showErr,setShowErr] =useState(false)
    const [mail,setMail] =useState('')

    //hesabı daha önce açıksa
    useEffect(()=>{
      if(auth.currentUser){
        navigate('/feed')
      }
    },[])

   //formun gönderilme olayı
   const handleSubmit = (e) => {
    e.preventDefault()
    const email = e.target[0].value
    setMail(email)
    const pass = e.target[1].value

  if(signUp){
    //yeni hesap oluşturma
createUserWithEmailAndPassword(auth,email, pass)
.then(()=>{
    navigate('/feed')
    toast.success('Hesabınız Oluşturuldu')
}).catch((err) => {
    toast.error(`Üzgünüz bir hata oluştu:${err.code}`)
})
  }else{
    //varolan hesaba giriş
    signInWithEmailAndPassword(auth , email , pass)
    .then(()=>{
        navigate('/feed')
        toast.success('Hesaba giriş yapıldı')
       
    })
    .catch((err) => {
        //şifresi yanlış ise true'ya çek
        if(err.code ==='auth/invalid-login-credentials'){
            setShowErr(true)
        }
        toast.error(`Üzgünüz bir hata oluştu:${err.code}`)
        
    })
    
   }
   }


    //yönlendirerek hesap açınca sonuçlara erişme 
   //google ile giriş
   const handleGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      toast.success('Google hesabınız ile giriş yapıldı');
      navigate('/feed');
    } catch (err) {
      console.log(err);
    }
  };
  
    //şifre sıfırlama isteği
    const handleReset = () => {
      sendPasswordResetEmail(auth, mail)
      .then(() => {
          toast.info(`${mail} adresinize sıfırlama e-postası gönderildi`);
      })
      .catch((error) => {
          const errorCode = error.code;
          toast.error(`Üzgünüz bir hata oluştu: ${errorCode}`);
      });
};
  
    
  return (
    <section className=" h-screen grid place-items-center">
   <div className="bg-black flex flex-col gap-10 py-16 px-32 rounded-lg">
   
   <div className="flex justify-center">
    <img  className="h-[60px] cursor-pointer" src="https://cdn1.img.sputniknews.com.tr/img/07e7/07/18/1073897068_140:0:516:376_1920x0_80_0_0_e2cb63a4c6bc513119a800c895ab51ba.png" alt="twitter-logo" />
   </div>
   <h1 className="text-center fw-bold text-lg ">X'e Giriş Yap</h1>


   <div onClick={handleGoogle} className="flex items-center bg-white py-2 px-10 rounded-full cursor-pointer gap-3 text-black hover:bg-gray-300 ">
    <img className="h-[20px]"  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png" alt="google-logo" />
    <span className='whitespace-nowrap'>Google İle Giriş Yap</span>
   </div>
   <form onSubmit={handleSubmit} className="flex flex-col" >
    <label >Email</label>
    <input className="text-black rounded mt-1 p-2 outline-none shadow-lg focus:shadow-[gray]" type="email"  required/>

    <label className="mt-5" >Şifre</label>
    <input className="text-black rounded mt-1 p-2 outline-none shadow-lg focus:shadow-[gray]" type="password" required />


<button  className="bg-white text-black mt-10 rounded-full font-bold p-2 transition-all hover:bg-gray-300 "> 
{signUp ? 'Kaydol' : 'Giriş Yap'}</button>
    <p className="mt-5 flex gap-1 ">
        <span className=" text-center items-center"> {signUp ? 'Hesabınız Varsa' : 'Hesabınız Yoksa'}</span>
        <span onClick={()=>setSignUp(!signUp)}  className="text-[#38a7f2] cursor-pointer  hover:underline">
            
      {signUp ? 'Giriş Yap' : 'Kaydol'}
        </span>
    </p>

   </form>

   
   {/*Şifreden kaynaklı hata var ise göster  */}
{
    showErr && (<p 
    onClick={handleReset} 
    className='text-red-400 cursor-pointer text-center hover:underline'
    >Şifrenizi mi Unuttunuz?
    </p>
)}
   
   </div>
    </section>
  )
}

export default AuthPage
