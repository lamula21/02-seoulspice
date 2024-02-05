import { useAppSelector } from "../hooks/useRedux"

/**
 * Get current board id by board name
 * @param boardTab - The name of the board
 * @returns The id of the board
 */
export function getCurrentBoardId(boardTab: string | undefined) {
	const boardData = useAppSelector((state) => state.data)
	const currentBoardData = boardData.data.find((item) => item.name === boardTab)
	return currentBoardData?.id
}
