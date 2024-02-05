import { collection, deleteDoc, doc } from "firebase/firestore"
import { db } from "../../lib/firebase"

export async function removeTask(
	currentBoardId: string | undefined,
	columnId: string,
	taskId: string
) {
	if (!currentBoardId) {
		return
	}

	try {
		const boardDocRef = doc(db, "boards", currentBoardId)
		const columnsCollectionRef = collection(boardDocRef, "columns")
		const columnDocRef = doc(columnsCollectionRef, columnId)
		const tasksCollectionRef = collection(columnDocRef, "tasks")
		const taskDocRef = doc(tasksCollectionRef, taskId)
		await deleteDoc(taskDocRef)
	} catch (error) {
		console.error("Error removing Task: ", error)
	}
}
