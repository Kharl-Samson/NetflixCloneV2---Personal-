import { useQuery } from "react-query"
import { getSearchQuery } from "../../services/apiFetchShowList"
import { useRouteAndQueryParams } from "../../utils/itemsFunction"
import { useMemo } from "react"

export const Page = () => {
    // Params Url Getter
    const { params } = useRouteAndQueryParams()

    // Fetch show data 
    const { data : searchData1, isFetched: isFetchedSearchData1 } = useQuery(
      ["searchDataKey1", params],
      () => getSearchQuery(params, 1)
    )
    const { data : searchData2, isFetched: isFetchedSearchData2 } = useQuery(
      ["searchDataKey2", params],
      () => getSearchQuery(params, 2)
    )
    const { data : searchData3, isFetched: isFetchedSearchData3 } = useQuery(
      ["searchDataKey3", params],
      () => getSearchQuery(params, 3)
    )

    const combinedData = useMemo(() => {
      if (isFetchedSearchData1 && isFetchedSearchData2 && isFetchedSearchData3) {
        return {
          results: (searchData1?.results || []).concat(searchData2?.results || []).concat(searchData3?.results || []),
        }
      }
      return null
    }, [searchData1, searchData2, searchData3])

  return (
    <section className="mt-[4.5rem] min-h-screen fixed inset-0 z-[49] bg-[#181414] overflow-y-scroll search-section px-14">
        
      <div className="mt-[6rem] flex gap-x-5">
        <p className="text-2xl text-[#808080] whitespace-nowrap">More to explore: </p>

        {/* More related title */}
        <div className="mt-[-2px] flex flex-wrap items-center gap-x-3">
          {// Related title mapping
          combinedData && combinedData.results
            .reduce((unique: {title: string}[], item: {title: string}) => {
              !unique.some(obj => obj?.title?.toUpperCase() === item?.title?.toUpperCase()) && unique.push(item)
              return unique
            }, [])
            .slice(0,9)
            .filter((res: { title:  string }) => res.title !== undefined)
            .map((res: {title : string}, index: number, array: {title: string}[]) => 
              <div key={res.title} className="flex items-center gap-x-3">
                <p className="text-2xl">{res.title}</p>
                {index !== array.length - 1 && <div className="h-[2.2rem] w-[1px] bg-[#cfcfcf]"></div>}
              </div>
          )}
        </div>
        
      </div>

    </section>
  )
}
