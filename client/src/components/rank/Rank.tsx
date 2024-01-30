import rankData from "../../data/rankData"

type RankProps = {
    index : number
    onMouseOver?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Rank = ({index, onMouseOver} : RankProps) => {
  return (
    <div onMouseOver = {onMouseOver}>{rankData[index]}</div>
  )
}
