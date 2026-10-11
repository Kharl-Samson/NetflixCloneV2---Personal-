import { styled } from "@mui/material/styles"
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppStore } from "../../store/ZustandStore"

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

export const Page = () => {
  const body = document.body
  body.style.overflowY = "hidden"

  // Zustand State
  const {screenWidth} = useAppStore()

	// Url params
	const { genreId, trackId } = useParams()
  const urlParams = new URLSearchParams(window.location.search)
  const seasonParams = urlParams.get("season")
  const episodeParams = urlParams.get("episode")

	// Navigate
	const navigate = useNavigate()

	// Iframe props
  const iframeProps = {
    allowFullScreen: true,
    scrolling: "no",
    title: "Video Player",
    frameBorder: "0",
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
  }

	// Video Url
	const [url, setUrl] = useState<string>("")
	useEffect(() => {
		genreId === "tv" ? 
      setUrl(`https://vidsrc.to/embed/tv/${trackId}/${seasonParams}/${episodeParams}`) 
    : 
      setUrl(`https://vidsrc.to/embed/movie/${trackId}`)
	},[genreId, trackId])

  // Go back
  const goBack = () => {
    if(screenWidth < 640){
      const body = document.body
      body.style.overflowY = "scroll"
    }
    navigate(-1)
  }

  return (
    <>        
			<LightTooltip title="Close">
      	<p className="text-5xl mt-[-2px] text-white cursor-pointer absolute right-5 top-1" onClick={goBack}>&#215;</p>
			</LightTooltip>
      <iframe src={url} {...iframeProps} className="h-screen w-full"/>
    </>
  )
}
