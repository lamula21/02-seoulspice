import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../../lib/firebase"

export async function getAllBoards(userId: string | undefined) {
	if (!userId) {
		return { error: "User id is required" }
	}

	// // Get all boards where ownerId is equal to userId
	// const boardsCollectionRef = collection(db, "boards")
	// const q = query(boardsCollectionRef, where("ownerId", "==", userId))

	// // Get all boards
	// const querySnapshot = await getDocs(q)
	// const boardDoc = querySnapshot.docs[0]
	// const boardDocRef = boardDoc.ref
	// const boardDocData = boardDoc.data()
	// // console.log(boardDocs[0].data())
	// // console.log(board)

	// const querySnapshot1 = await getDocs(collection(boardDocRef, "columns"))
	// querySnapshot1.forEach((doc) => {
	// 	console.log(doc.data())
	// })

	const boardsCollectionRef = collection(db, "boards")
	const q = query(boardsCollectionRef, where("ownerId", "==", userId))

	const querySnapshot = await getDocs(q)
	const boards = querySnapshot.docs.map((doc) => doc.data())

	const boardsData = await Promise.all(
		boards.map(async (board) => {
			const columnsCollectionRef = collection(db, "boards", board.id, "columns")
			const columnsSnapshot = await getDocs(columnsCollectionRef)
			const columns = columnsSnapshot.docs.map((doc) => doc.data())

			const columnsData = await Promise.all(
				columns.map(async (column) => {
					const tasksCollectionRef = collection(
						db,
						"boards",
						board.id,
						"columns",
						column.id,
						"tasks"
					)
					const tasksSnapshot = await getDocs(tasksCollectionRef)
					const tasks = tasksSnapshot.docs.map((doc) => doc.data())

					return { ...column, tasks }
				})
			)

			return { ...board, columns: columnsData }
		})
	)

	return { boards: boardsData }
}
