import {
	and,
	collection,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore"
import { db } from "../../lib/firebase"
import { ITask } from "../../data/type"

export async function createTask(
	currentBoardId: string | undefined,
	data: ITask,
	userId: string | undefined
) {
	const { id, title, description, status, subtasks, statusId } = data

	if (!currentBoardId || !userId) {
		return
	}

	try {
		const q = query(
			collection(db, "boards"),
			and(where("ownerId", "==", userId), where("id", "==", currentBoardId))
		)

		const boardRef = (await getDocs(q)).docs[0].ref

		const columnsRef = collection(boardRef, "columns")
		const columnDocRef = doc(columnsRef, statusId)

		const tasksRef = collection(columnDocRef, "tasks")
		const taskRef = doc(tasksRef, id)

		await setDoc(taskRef, {
			id,
			title,
			description,
			status,
			statusId: columnDocRef.id,
			subtasks,
		})
	} catch (error) {
		console.error("Error adding task: ", error)
	}
}
