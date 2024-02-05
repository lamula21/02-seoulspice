import { useEffect } from "react"
import Header from "./layout/Header"
import Main from "./layout/Main"
import Modals from "./components/Modals"
import { getLocalData, hydrate, setBoardStatus } from "./reducer/dataSlice"
import { closeModal, openModal } from "./reducer/modalSlice"
import { toggleTheme } from "./reducer/dataSlice"
import { useAppDispatch, useAppSelector } from "./hooks/useRedux"
import { setTab } from "./reducer/boardTabSlice"
import "./App.scss"
import { loadState, store } from "./store"
import { getAllBoards } from "./services/boards/getAllboards"
import { IBoard } from "./data/type"

const App = () => {
	const dispatch = useAppDispatch()
	const colorTheme = useAppSelector((state) => state.data.colorTheme)
	const userId = useAppSelector((state) => state.auth.email)

	const handleColorTheme = () => {
		return colorTheme === "dark"
			? dispatch(toggleTheme("light"))
			: dispatch(toggleTheme("dark"))
	}
	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			dispatch(closeModal)
		}
	}
	useEffect(() => {
		document.addEventListener("keydown", handleKeyPress)
		return () => document.removeEventListener("keydown", handleKeyPress)
	}, [])

	useEffect(() => {
		const persistedState = loadState()
		const fetchData = async () => {
			if (!userId) return
			try {
				// const response = await import("./data/data.json") // change here from db
				// const data = response.boards
				const { boards: data } = (await getAllBoards(userId)) as {
					boards: IBoard[]
				}

				dispatch(getLocalData(data)) // change here from db
				dispatch(setTab(data[0].name))
				dispatch(setBoardStatus(data[0].name))
			} catch (err) {
				console.error(err)
			}
		}
		if (persistedState) {
			store.dispatch(hydrate(persistedState.data))
		}
		if (persistedState && persistedState.data.data.length === 0) {
			fetchData()
		}

		// getAllBoards(userId).then((data) => console.log(data))
	}, [])

	return (
		<div className={`App ${colorTheme}`}>
			<Header colorTheme={colorTheme} />
			<Main themeChange={handleColorTheme} />
			<Modals />
		</div>
	)
}

export default App
