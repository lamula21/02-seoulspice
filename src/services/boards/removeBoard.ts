import {
	and,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	where,
} from "firebase/firestore"
import { db } from "../../lib/firebase"

/**
 * Removes a board from the database from a specific user
 * @param currentBoardId - the id of the board to remove
 * @param ownerId - the id of the user who owns the board
 * @returns void
 */
export async function removeBoard(
	currentBoardId: string | undefined,
	ownerId: string
) {
	if (!currentBoardId) {
		return
	}

	try {
		const boardDocRef = doc(db, "boards", currentBoardId)

		// delete all columns and tasks
		const columnsCollectionRef = collection(boardDocRef, "columns")
		const querySnapshot = await getDocs(columnsCollectionRef)
		querySnapshot.forEach((doc) => {
			deleteDoc(doc.ref)
		})

		// delete the board
		await deleteDoc(boardDocRef)
	} catch (error) {
		console.error("Error removing Board: ", error)
	}
}
