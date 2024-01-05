import searchIcon from "../../assets/images/icons/search.png"
import closeIcon from "../../assets/images/icons/close.png"
import { SetStateAction, useEffect, useRef, useState } from "react"

export const SearchInput = () => {
    //Click Search Input
    const inputRef = useRef<HTMLInputElement>(null)
    const parentRef = useRef<HTMLDivElement>(null)
    const [isSearchClick, setSearchClick] = useState<boolean>(false)
    const clickSearch = () => {
        inputRef?.current?.focus()
        setSearchClick(true)
    }

    // Close Search Input
    const closeSearchInput = (event: MouseEvent) => parentRef.current && !parentRef.current.contains(event.target as Node) && setSearchClick(false)
    useEffect(() => {
        isSearchClick ? document.addEventListener("mousedown", closeSearchInput) : document.removeEventListener("mousedown", closeSearchInput)
        return () =>  document.removeEventListener("mousedown", closeSearchInput)
    }, [isSearchClick])

    // When the user inputted in search input
    const [searchValue, setSearchValue] = useState<string>('')
    const handleChange = (event: { target: { value: SetStateAction<string> } }) => {
        setSearchValue(event?.target?.value)
    }
    useEffect(() => {
        searchValue !== "" ? setSearchClick(true) : setSearchClick(false)
    },[searchValue])

    // Clear Search Input
    const clearSearchInput = () => setSearchValue("")

  return (
    <div 
        ref={parentRef}
        className = {
            `flex h-10 border custom-transition-duration-3s cursor-pointer hover:opacity-80
            ${isSearchClick ? "bg-black bg-opacity-80 border-solid border-white" : "bg-transparent border-transparent"}`
        }
    >
        <div className={`h-10 custom-transition-duration-3s flex items-center justify-center active:scale-110 ${isSearchClick ? "w-10" : "w-auto"}`} onClick={clickSearch}>
            <img src={searchIcon} alt="Search Image" className="h-5"/>
        </div>

        <input type="text" 
            ref={inputRef}
            placeholder="Titles, people, genres"
            autoComplete="off"
            value={searchValue}
            onChange={handleChange}
            className={
                `border-none h-10 bg-transparent outline-none netflix-font-light text-white text-sm pl-1 w-0 custom-transition-duration-3s ${isSearchClick && "w-48"}`
            }
        />

        <div className={`w-0 flex items-center justify-center custom-transition-duration-3s ${isSearchClick && "w-12"}`}>
          <img src={closeIcon} alt="Close Image" className={`h-[15px] ${searchValue === "" && "hidden"}`} onClick={clearSearchInput}/>
        </div>
    </div>
  )
}
