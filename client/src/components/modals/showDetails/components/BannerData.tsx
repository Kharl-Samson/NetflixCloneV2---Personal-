import play from "../../../../assets/images/icons/play.png"
import add from "../../../../assets/images/icons/add.png"
import { toggleVideoSoundModal, useClickHandlers } from "../../../../utils/itemsFunction"
import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import { useAppStore } from "../../../../store/ZustandStore"
import logo from "../../../../assets/images/icons/logo.png"

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "#1e1e1e",
      boxShadow: theme.shadows[1],
      fontSize: 20,
      fontWeight: "bold",
      padding: ".5rem 1.50rem"
    },
}))

type BannerDataProps = {
  showDetailsData : {
    id : number
    title? : string
    name? : string
    original_title? : string
    networks : {
      name : string
    }[]
    number_of_seasons? : number
  }
}

export const BannerData = ({showDetailsData} : BannerDataProps) => {
    // React Youtube State
    const { showVideoModal, isMutedModal, videoEndedModal } = useAppStore()

    // Items Functions Util
    const { navigateToWatch } = useClickHandlers()

  return (
    <div 
      className={`relative z-[5] px-11
      ${showDetailsData && showDetailsData.networks && showDetailsData.networks.some((network: {name : string}) => network.name === "Netflix") ? 
      "mt-[-18.8rem]" : "mt-[-17.5rem]"}`}
    >

      {/* If the item is produce by Netflix */
      showDetailsData && showDetailsData.networks && showDetailsData.networks.some((network: {name : string}) => network.name === "Netflix") && 
      <div className="flex items-center gap-x-1 mb-1">
        <img src={logo} alt="Netflix logo" className="h-4"/>
        <p className="text-[.60rem] text-[#cecece] tracking-[0.3rem] font-bold mt-[2px]">SERIES</p>
      </div>
      }

      <p 
        className="text-white custom-transition-duration-10s
          movie-title-font-large max-w-[40rem] xl:max-w-[80%] 
          leading-tight text-4xl capitalize"
      >
        {showDetailsData?.title || showDetailsData?.name || showDetailsData?.original_title}
      </p>

      <div className="mt-8 flex justify-between gap-x-[15px] ">
        {/* Play and Add */}
        <div className="flex items-center gap-x-[15px]">
          <button 
            className="rounded flex items-center gap-x-[15px] py-[5px] px-[45px] transition duration-400 bg-white hover:opacity-80"
            onClick={() => navigateToWatch(showDetailsData?.number_of_seasons ? "tv" : "movie", showDetailsData?.id)}
          >
            <img src={play} alt="Play Icon" className="h-[25px]"/>
            <span className="text-[1.3em] font-semibold">Play</span>
          </button>

          {/* Add to Mylist */}
          <LightTooltip title="Add to My List" arrow sx={{'& .MuiTooltip-arrow': {color: '#ffff',},}}>
            <div className="bg-[#232323] rounded-full h-11 w-11 flex items-center justify-center border-2 border-[#8b8b8b] cursor-pointer">
              <img src={add} alt="Play Icon" className="h-5"/>
            </div>
          </LightTooltip>
        </div>

        {/* Video Sound Controller */}
        <div 
          className={`h-[42px] w-[42px] border-[2px] border-solid border-[#767576] text-[#767576] rounded-full 
            items-center cursor-pointer justify-center transition duration-400 hover:bg-gray-600 hover:bg-opacity-35 flex 
            hover:cursor-pointer ${(showVideoModal || videoEndedModal) ? "flex" : "hidden"}`} 
          onClick={toggleVideoSoundModal}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${showVideoModal && isMutedModal && !videoEndedModal ? "block" : "hidden"}`}><path d="M11 4.00003C11 3.59557 10.7564 3.23093 10.3827 3.07615C10.009 2.92137 9.57889 3.00692 9.29289 3.29292L4.58579 8.00003H1C0.447715 8.00003 0 8.44774 0 9.00003V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00003ZM5.70711 9.70714L9 6.41424V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70714ZM15.2929 9.70714L17.5858 12L15.2929 14.2929L16.7071 15.7071L19 13.4142L21.2929 15.7071L22.7071 14.2929L20.4142 12L22.7071 9.70714L21.2929 8.29292L19 10.5858L16.7071 8.29292L15.2929 9.70714Z" fill="currentColor"></path></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${showVideoModal && !isMutedModal && !videoEndedModal ? "block" : "hidden"}`}><path d="M24 12C24 8.28699 22.525 4.72603 19.8995 2.10052L18.4853 3.51474C20.7357 5.76517 22 8.81742 22 12C22 15.1826 20.7357 18.2349 18.4853 20.4853L19.8995 21.8995C22.525 19.274 24 15.7131 24 12ZM11 4.00001C11 3.59555 10.7564 3.23092 10.3827 3.07613C10.009 2.92135 9.57889 3.00691 9.29289 3.29291L4.58579 8.00001H1C0.447715 8.00001 0 8.44773 0 9.00001V15C0 15.5523 0.447715 16 1 16H4.58579L9.29289 20.7071C9.57889 20.9931 10.009 21.0787 10.3827 20.9239C10.7564 20.7691 11 20.4045 11 20V4.00001ZM5.70711 9.70712L9 6.41423V17.5858L5.70711 14.2929L5.41421 14H5H2V10H5H5.41421L5.70711 9.70712ZM16.0001 12C16.0001 10.4087 15.368 8.8826 14.2428 7.75739L12.8285 9.1716C13.5787 9.92174 14.0001 10.9392 14.0001 12C14.0001 13.0609 13.5787 14.0783 12.8285 14.8285L14.2428 16.2427C15.368 15.1174 16.0001 13.5913 16.0001 12ZM17.0709 4.92896C18.9462 6.80432 19.9998 9.34786 19.9998 12C19.9998 14.6522 18.9462 17.1957 17.0709 19.0711L15.6567 17.6569C17.157 16.1566 17.9998 14.1218 17.9998 12C17.9998 9.87829 17.157 7.84346 15.6567 6.34317L17.0709 4.92896Z" fill="currentColor"></path></svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`Hawkins-Icon Hawkins-Icon-Standard ${videoEndedModal ? "block" : "hidden"}`}><path d="M13.1747 3.07702C11.01 2.79202 8.81537 3.30372 6.99988 4.51679C5.18439 5.72987 3.8718 7.56158 3.30668 9.67065C2.74155 11.7797 2.96243 14.0223 3.92815 15.9806C4.89388 17.9389 6.53859 19.4794 8.55586 20.3149C10.5731 21.1505 12.8254 21.2242 14.893 20.5224C16.9606 19.8205 18.7025 18.391 19.7942 16.5L18.0622 15.5C17.2131 16.9708 15.8582 18.0826 14.2501 18.6285C12.642 19.1744 10.8902 19.1171 9.32123 18.4672C7.75224 17.8173 6.47302 16.6192 5.7219 15.096C4.97078 13.5729 4.79899 11.8287 5.23853 10.1883C5.67807 8.5479 6.69897 7.12324 8.11102 6.17973C9.52307 5.23623 11.23 4.83824 12.9137 5.05991C14.5974 5.28158 16.1432 6.10778 17.2629 7.3846C18.1815 8.43203 18.762 9.7241 18.9409 11.0921L17.5547 10.168L16.4453 11.8321L19.4453 13.8321C19.7812 14.056 20.2188 14.056 20.5547 13.8321L23.5547 11.8321L22.4453 10.168L20.9605 11.1578C20.784 9.27909 20.0201 7.49532 18.7666 6.06591C17.3269 4.42429 15.3395 3.36202 13.1747 3.07702Z" fill="currentColor"></path></svg>
        </div>
      </div>
    </div>
  )
}
