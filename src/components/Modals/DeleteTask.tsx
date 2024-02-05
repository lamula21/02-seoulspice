import { useState } from "react"
import { IconSpinner } from "../../data/icons"
import { IModal } from "../../data/type"
import { useAppDispatch } from "../../hooks/useRedux"
import { deleteTask } from "../../reducer/dataSlice"
import { closeModal } from "../../reducer/modalSlice"
import Button from "../../standard/Button"
import Modal from "../../standard/Modal"
import { removeTask } from "../../services/tasks/removeTask"
import { getCurrentBoardId } from "../../helper/getCurrentBoardId"

const DeleteTask = (props: IModal) => {
	const [isLoading, setIsLoading] = useState(false)

	const dispatch = useAppDispatch()
	const { boardTab, ModalDetail } = props

	const boardId = getCurrentBoardId(boardTab)

	const handleDelete = async () => {
		setIsLoading(true)
		await removeTask(boardId, ModalDetail.statusId, ModalDetail.id)

		dispatch(deleteTask({ currentBoardTab: boardTab, task: ModalDetail }))
		dispatch(closeModal())
		setIsLoading(false)
	}

	const handleCancel = () => {
		dispatch(closeModal())
	}

	return (
		<Modal>
			<div className="DeleteBoard">
				<div className="DeleteBoard__topWrapper">
					<h2 className="DeleteBoard__text-title">Delete this task?</h2>
					<p className="DeleteBoard__text-info">
						Are you sure you want to delete the &apos;{ModalDetail.title}&apos;
						board? This action will remove all columns and tasks and cannot be
						reversed.
					</p>
				</div>
				<div className="DeleteBoard__btnWrapper">
					<Button
						small
						className="DeleteBoard__btn--delete"
						onClick={handleDelete}
						disabled={isLoading}
						style={{
							opacity: isLoading ? 0.5 : 1,
						}}
					>
						{isLoading && <IconSpinner />}
						{!isLoading && "Delete"}
					</Button>

					<Button
						small
						className="DeleteBoard__btn--cancel"
						onClick={handleCancel}
					>
						Cancel
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default DeleteTask
