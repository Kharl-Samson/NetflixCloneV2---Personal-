
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import SearchIcon from "@mui/icons-material/Search"
import { useNavigate } from "react-router-dom"
import CancelIcon from "@mui/icons-material/Cancel"

export const Page = () => {
    // Navigate
    const navigate = useNavigate()

    // Get search value params
    const urlParams = new URLSearchParams(window.location.search)
    const sParam = urlParams.get("s")

  return (
    <section className="w-full">
        {/* Back and search bar */}
        <div className="px-3 h-[3rem] flex items-center bg-[#181414] sticky top-0">
            <ArrowBackIosNewIcon onClick={() => navigate(-1)} style={{marginLeft:"-.5rem", color:"white"}}/>
            {/* Search input */}
            <div className="h-[2rem] ml-5 pr-1 bg-[#424242] flex-grow rounded flex items-center overflow-hidden">
                <SearchIcon style={{color:"#7c7c7c", fontSize:"1.75rem", margin:"0 .5rem"}}/>
                <input 
                    type="text" 
                    className="flex-grow mr-1 text-sm h-[1.9rem] outline-none placeholder-[#7c7c7c] border-none bg-transparent text-white"
                    autoComplete="off"
                    placeholder="Search shows, movies..."
                    autoFocus
                />
                <CancelIcon style={{color:"#7c7c7c", fontSize:"1.1rem"}}/>
            </div>
        </div>

        {/* Items list container */}
        <div className="mx-3 mt-1 h-[2remm]">
        { /* Show recommended items 
           * If no search value yet */
        !sParam && 
           <>
            <p className="text-white text-base font-semibold">Recommended TV Shows & Movies</p>

            {/* Items Container */}
            <div>

            </div>
           </> 
        }
        </div>
    </section>
  )
}
