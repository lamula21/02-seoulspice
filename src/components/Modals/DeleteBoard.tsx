import { useState } from "react"
import { IModal } from "../../data/type"
import { getCurrentBoardId } from "../../helper/getCurrentBoardId"
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux"
import { deleteBoard } from "../../reducer/dataSlice"
import { closeModal } from "../../reducer/modalSlice"
import { removeBoard } from "../../services/boards/removeBoard"
import Button from "../../standard/Button"
import Modal from "../../standard/Modal"
import { IconSpinner } from "../../data/icons"

const DeleteBoard = (props: IModal) => {
	const [isLoading, setIsLoading] = useState(false)

	const dispatch = useAppDispatch()
	const { boardTab } = props

	const boardId = getCurrentBoardId(boardTab)
	const userId = useAppSelector((state) => state.auth.userId)

	const handleDelete = async () => {
		setIsLoading(true)
		removeBoard(boardId, userId)

		dispatch(deleteBoard(boardTab))
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
					<h2 className="DeleteBoard__text-title">Delete this board?</h2>
					<p className="DeleteBoard__text-info">
						Are you sure you want to delete the &apos;{boardTab}&apos; board?
						This action will remove all columns and tasks and cannot be
						reversed.
					</p>
				</div>
				<div className="DeleteBoard__btnWrapper">
					<Button
						small
						className="DeleteBoard__btn--delete"
						onClick={handleDelete}
					>
						Delete
					</Button>
					<Button
						small
						className="DeleteBoard__btn--cancel"
						onClick={handleCancel}
						disabled={isLoading}
						style={{
							opacity: isLoading ? 0.5 : 1,
						}}
					>
						{isLoading && <IconSpinner />}
						{!isLoading && "Cancel"}
					</Button>
				</div>
			</div>
		</Modal>
	)
}

export default DeleteBoard
