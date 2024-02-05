import {
	collection,
	collectionGroup,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
	where,
} from "firebase/firestore"
import { ITask } from "../../data/type"
import { db } from "../../lib/firebase"

export async function updateTask(
	currentBoardId: string | undefined,
	data: ITask
) {
	if (!currentBoardId) {
		return
	}

	const { id, title, description, subtasks, status, statusId } = data

	try {
		// delete the task from the previous status
		const tasksCollectionGroup = collectionGroup(db, "tasks")
		const querySnapshot = await getDocs(tasksCollectionGroup)
		querySnapshot.forEach((doc) => {
			if (doc.data().id === id) deleteDoc(doc.ref)
		})

		// add the task to the new status
		const boardDocRef = doc(db, "boards", currentBoardId)
		const columnsCollectionRef = collection(boardDocRef, "columns")
		const columnDocRef = doc(columnsCollectionRef, statusId)
		const tasksCollectionRef = collection(columnDocRef, "tasks")
		const taskDocRef = doc(tasksCollectionRef, id)
		await setDoc(taskDocRef, {
			id,
			title,
			description,
			status,
			statusId,
			subtasks,
		})
	} catch (error) {
		console.error("Error updating Task: ", error)
	}
}
