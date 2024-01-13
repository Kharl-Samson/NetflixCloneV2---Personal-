import rankData from "../../data/rankData"

type RankProps = {
    index : number
    onMouseOver : any
}

export const Rank = ({index, onMouseOver} : RankProps) => {
  return (
    <div onMouseOver = {onMouseOver}>{rankData[index]}</div>
  )
}
