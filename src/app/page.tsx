/* eslint-disable @next/next/no-img-element */
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import '../styles/pages/home.module.css'
import backgroundDefault from '../assets/images/home/bg-1.jpg'
import Header from '@/ui/components/common/Header'
import DetectNetwork from '@/ui/components/common/DetectNetwork'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomePage from '@/ui/modules/HomePage'

const Home = () => {
  return (
    <>
      <DetectNetwork />
      <div className="home-page h-screen relative flex flex-col items-center justify-center">
        <img
          src={backgroundDefault.src}
          loading="lazy"
          alt="background"
          className="background-default absolute object-cover w-full h-full"
        />
        <HomePage />
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={3}
        hideProgressBar
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="dark"
        className={"toast-container-custom"}
      />
    </>
  );
}

export default Home
