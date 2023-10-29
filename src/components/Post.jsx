import moment from "moment";
import { BsThreeDots } from "react-icons/bs"
import { auth, db } from "../firebase/config";
import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineHeart } from "react-icons/ai";
import { FaRetweet } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import { doc,deleteDoc,updateDoc,arrayUnion,arrayRemove } from "firebase/firestore";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import{ FcLike} from 'react-icons/fc'




const Post = ({tweet}) => {
  const [isLiked,setIsLiked] = useState(false)
  const date = moment(tweet.createdAt?.toDate()).fromNow();

  //kullanıcının tweeti beğenip beğenmediğine bakma
  useEffect(()=>{
 const found = tweet.likes.find((userId)=>
 userId === auth.currentUser.uid
 )
 setIsLiked(found)
  },[tweet])
  
  //tweeti siler
  const handleDelete = () => {
  if(confirm("Tweeti silmeyi onaylıyor musunuz ?")){
   //silmek istediğimiz belgenin referansını alma
   const docRef = doc(db, 'tweet', tweet.id);
   deleteDoc(docRef)
   .then(() => {
     toast.success('Tweet başarıyla silindi');
   })
   .catch((error) => {
     console.error("Belge silinirken hata oluştu: ", error);
   });
}}

const toggleLike = async () => {
 const  docRef = doc(db, 'tweet', tweet.id);
 await updateDoc(docRef,{
  // diziye tweeti likelayan kullanıcının id'sini ekleme kaç kişi like'lamış öğrenme
  
  //kullanıcı like'ladıysa kalp iconu basılsın like geri çekilirse de içi dolu olan kalp iconu içi boş hale gelsin 
  likes: isLiked ?
   arrayRemove(auth.currentUser.uid)
   :arrayUnion(auth.currentUser.uid)
 })
}
  
  return (
    <div className="flex gap-3 p-3 border-b-[1] border-gray-600  ">
  <img className="w-14 h-14 rounded-full" src={tweet.user.photo} alt="user_picture" />
  
  <div className="w-full">
    {/* Üst kısım >kullanıcı bilgileri */}
    <div className="flex justify-between ">
      <div className="flex items-center gap-3">
        <p className="font-bold" >{tweet.user.name}</p>
        <p className="text-gray-400">@{tweet.user.name.toLowerCase()}</p>
        <p  className="text-gray-400" >{date}</p>
      </div>

      {tweet.user.id === auth.currentUser.uid &&(
      <div onClick={handleDelete} className="p-2 rounded-full  cursor-pointer hover:bg-gray-700" >
        <BsThreeDots/>
        </div> 
      )}
   
    </div>
    {/* orta kısım > tweet içeriği */}
    <div className="my-3" >
      <p>{tweet?.textContent}</p>
      {/* eğer ki fotoğraf varsa onu ekrana bas */}
      {tweet.imageContent && <img className="w-full object-contain max-h-[300px] mt-3 rounded-lg " src={tweet.imageContent}/>}

    </div>
    {/* alt kısım > etkileşim butonları*/}
    <div className="flex items-center justify-between">
      <div className=" flex gap-1 items-center p-2   rounded-full transition cursor-pointer hover:bg-[#61b8f2] ">
        <BiMessageRounded  />
       {/*  <span>{Math.round(Math.random()*900)}</span> */}
      </div>
      <div className=" flex gap-1 items-center p-2   rounded-full transition cursor-pointer hover:bg-[#00ba7c] " >
        <FaRetweet/>
       {/*  <span>{Math.round(Math.random()*900)}</span> */}
      </div>
      <div onClick={toggleLike} className=" flex gap-1 items-center p-2   rounded-full transition cursor-pointer hover:bg-[#f9288a44] " >
       { isLiked ? <FcLike/> : <AiOutlineHeart/>}
        <span>{tweet.likes.length}</span>
      </div>
      <div className=" flex gap-1 items-center p-2   rounded-full transition cursor-pointer hover:bg-[#4eb0f1] " >
        <FiShare2/>
      </div>
    </div>
  </div>
    </div>
  )
  }
export default Post
