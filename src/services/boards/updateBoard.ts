import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
	updateDoc,
} from "firebase/firestore"
import { IAuth, IBoard } from "../../data/type"
import { db } from "../../lib/firebase"

export async function updateBoard(
	currentBoardId: string | undefined,
	data: Omit<IBoard, "ownerId">, // no access to change ownerId
	userId: IAuth["email"]
) {
	if (!currentBoardId) {
		return
	}

	const { columns, name } = data

	const boardDocRef = doc(db, "boards", currentBoardId)

	try {
		await updateDoc(boardDocRef, {
			name,
		})

		// delete all columns and tasks
		const columnsCollectionRef = collection(boardDocRef, "columns")
		const querySnapshot = await getDocs(columnsCollectionRef)
		querySnapshot.forEach((doc) => {
			deleteDoc(doc.ref)
		})

		// reinsert columns and tasks
		columns?.forEach(async (column) => {
			const columnDocRef = doc(boardDocRef, "columns", column.id)

			await setDoc(columnDocRef, {
				id: column.id,
				name: column.name,
			})

			column?.tasks?.forEach(async (task) => {
				const taskRef = doc(columnDocRef, "tasks", task.id)
				await setDoc(taskRef, {
					id: task.id,
					title: task.title,
					description: task.description,
					status: task.status,
					statusId: task.statusId,
					subtasks: task.subtasks,
				})
			})
		})
	} catch (error) {
		console.error("Error updating Board: ", error)
	}
}
