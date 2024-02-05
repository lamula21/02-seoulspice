import { collection, doc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { IAuth, IBoard } from "../../data/type"

/**
 * Create a new board in the firestore database
 * @param boardData - The board object to be created
 */
export async function createBoard(boardData: IBoard, userId: IAuth["email"]) {
	const { id, name, columns } = boardData

	try {
		const boardsRef = doc(db, "boards", id)
		await setDoc(boardsRef, {
			id,
			name,
			ownerId: userId,
		})

		const columnsRef = collection(boardsRef, "columns")
		columns?.forEach(async (column) => {
			const columnRef = doc(columnsRef, column.id)

			await setDoc(columnRef, {
				id: column.id,
				name: column.name,
			})
		})
	} catch (error) {
		console.error("Error creating board:", error)
		throw new Error("Failed to create board")
	}
}
