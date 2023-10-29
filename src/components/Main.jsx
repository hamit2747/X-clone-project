import { useEffect, useState } from "react"
import  Form  from "./Form"
import Post from "./Post"
import { onSnapshot,collection,query,orderBy} from "firebase/firestore"
import { db } from "../firebase/config"
import Loading from "./Loading"

const Main = ({user}) => {
  //verileri 30 kere render edeceğimize state'te tutup tek bir kere render ettik
  const [tweet,setTweet] = useState(null)
  const tweetCol = collection(db,'tweet')

  useEffect(()=>{
    
    // filtreleme alanı tanımlama 
     const options = query(tweetCol,orderBy('createdAt',"desc"))
    
     //kolleksiyona abone olma
     onSnapshot(options,(snapshot)=>{
    
      //tweetleri geçici olarak tuttuğumuz dizi
    const tempTweet = []
    
    //her bir dökümanın verisine ulaşıp diziye aktarma bir de id lerini gönderme
    snapshot.forEach((doc)=>{
     tempTweet.push({...doc.data(),id:doc.id})
    })
    //verileri state'a aktarma
     setTweet(tempTweet)
     });
  },[])
  return (
    <main className="col-span-4 md:col-span-2 xl:col-span-1 max-w-[600px] border border-gray-700 overflow-y-auto">
      <header className="font-bold p-4 border-b-[1px]   border-gray-700" >Anasayfa</header>
     <Form user={user}/>

   {!tweet ? <Loading/> : tweet.map((tweet)=>
    <Post key={tweet.id} tweet = {tweet} />
   )}

      
    </main>
  )
}

export default Main
