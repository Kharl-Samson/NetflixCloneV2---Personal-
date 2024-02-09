import Logo from "../../assets/images/logo.png"

export const Footer = () => {
  return (
    <footer 
        className="mt-[5rem] py-10"
    >
        <div className="max-w-[80%] sm:max-w-none w-10/12 mx-auto flex flex-col items-center">

            {/* Logo */}
            <img src={Logo} alt="Image Logo" className="w-[7rem] max-w-[80%]"/>

            <p className="text-sm text-[#979797] text-center mt-5">
                This site was developed by Kharl. It cannot and should not be reproduced in any forms or by any means without the consent from him.
            </p>

            <p className="mt-3 text-sm text-[#979797]">{new Date().getFullYear()} - Netflix Clone by Kharl. All rights reserved.</p>
        </div>
    </footer>
  )
}
