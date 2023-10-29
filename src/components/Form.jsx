import { BsCardImage } from 'react-icons/bs';
import { toast } from 'react-toastify';
import {
  collection,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

import { db, storage } from './../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { useState } from 'react';

const Form = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  // kolleksiyonun referansını alma
  const collectionRef = collection(db, 'tweet');

  // media'yı storage'a yükler ve url'i döndürür
  const uploadImage = async (image) => {
    if (!image) {
      return null;
    } else if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
      toast.info('Desteklenmeyen medya tipi. Yalnızca PNG veya JPEG dosyalarını yükleyebilirsiniz.');
      return null;
    }

    // storage'da dosya için yer ayarlama
    const storageRef = ref(storage, `${image.name}${v4()}`);

    try {
      // dosyayı yükleme
      await uploadBytes(storageRef, image);

      // yüklenen dosyanın URL'sini al
      const imageUrl = await getDownloadURL(storageRef);

      return imageUrl;
    } catch (error) {
      console.error('Medya yükleme hatası:', error);
      toast.error('Medya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      return null;
    }
  };

  // tweet atma
  const handleSubmit = async (e) => {
    e.preventDefault();

    const textContent = e.target[0].value;
    const imageContent = e.target[1].files[0];

    if (!textContent && !imageContent) {
      toast.info('Tweet içeriği veya medya ekleyin');
      return;
    }

    setIsLoading(true);

    // media'yı yükleme
    const imageUrl = await uploadImage(imageContent);

    // tweet'i kolleksiyona ekleme
    try {
      await addDoc(collectionRef, {
        textContent,
        imageContent: imageUrl, // Resmin URL'sini ekliyoruz
        createdAt: serverTimestamp(),
        user: {
          id: user.uid,
          name: user.displayName,
          photo: user.photoURL,
        },
        likes: [],
        isEdited: false,
      });

      // Formu sıfırla
      e.target.reset();
    } catch (error) {
      console.error('Tweet gönderme hatası:', error);
      toast.error('Tweet gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4 border-b-[1px] border-gray-700">
      <div className="flex items-center">
        <img className="rounded-full h-[35px] md:h-[45px] " src={user?.photoURL} />
        <input className="w-full bg-my-2 p-4 outline-none text-normal md:text-lg bg-transparent" placeholder="Neler Oluyor?" type="text" />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4 items-center">
          <label htmlFor="picture">
            <div className="rounded-full cursor-pointer transition p-4 hover-bg-gray-800">
              <BsCardImage className="text-blue-500 text-xl" />
            </div>
          </label>
          <input className="hidden" id="picture" type="file" />
          <div className="rounded-full p-4 cursor-pointer transition hover:bg-gray-700">
            <img className="bg-blue-400 h-[20px] w-[20px]" src="/gif-square (1).png" alt="" />
          </div>
          <div className="rounded-full p-4 cursor-pointer transition hover:bg-gray-700">
            <img className="bg-blue-400 h-[20px] w-[20px]" src="/icons8-survey-30.png" alt="" />
          </div>
          <div className="rounded-full p-4 cursor-pointer transition hover:bg-gray-700">
            <img className="bg-blue-400 h-[20px] w-[20px]" src="/icons8-smiling-50.png" alt="" />
          </div>
        </div>
        <button disabled={isLoading} className="bg-[#8ecdf7] flex items-center rounded-full transition p-2 hover:bg-[#1a8cd8]"
        
        
        >
            
   {isLoading && <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
    </svg>} Gönder
   
   </button>
      </div>
    </form>
  );
};

export default Form;
