import { UserCredential, signInWithPopup, signOut } from "firebase/auth"

import Button from "../../standard/Button"
import { auth, googleProvider } from "../../lib/firebase"
import { IconLogOut } from "../../data/icons"
import { resetUser, setUser } from "../../reducer/authSlice"
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux"
import { createUser } from "../../services/users/createUser"

export function SignIn() {
	const dispatch = useAppDispatch()
	const user = useAppSelector((state) => state.auth)

	const handleSignInWithGoogle = () =>
		signInWithPopup(auth, googleProvider).then((data: UserCredential) => {
			const authInfo = {
				userId: data.user.uid,
				name: data.user.displayName || "",
				email: data.user.email!,
				avatar: data.user.photoURL || "",
				isAuthenticated: true,
			}

			createUser(authInfo)

			dispatch(setUser(authInfo))

			window.location.reload()
		})

	const handleSignOut = () => {
		signOut(auth)
		dispatch(resetUser())
		// clear local storage
		localStorage.removeItem("kanban-app-state")
		window.location.reload()
	}

	return !user.isAuthenticated ? (
		<Button
			type="button"
			onClick={handleSignInWithGoogle}
			style={{
				marginLeft: "1.5rem",
				marginRight: "1.5rem",
				marginBottom: "1rem",
				width: "235px",
			}}
		>
			Sign In
		</Button>
	) : (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				marginLeft: "1.5rem",
				marginRight: "1.5rem",
				marginBottom: "1rem",
				width: "235px",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: "0.5rem",
					width: "199px",
				}}
			>
				<img
					src={user.avatar}
					alt="profile picture"
					style={{
						width: "34px",
						height: "34px",
						flexShrink: 0,
						borderRadius: "50%",
					}}
				/>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "start",
						overflow: "hidden",
						paddingLeft: "2px",
						paddingRight: "2px",
						maxWidth: "100%",
					}}
				>
					<p>{user.name}</p>
					<p
						style={{
							textOverflow: "ellipsis",
							overflow: "hidden",
							whiteSpace: "nowrap",
							width: "150px",
						}}
					>
						{user.email}
					</p>
				</div>
			</div>

			<button onClick={handleSignOut} className="SideNav__logoutButton">
				<IconLogOut />
			</button>
		</div>
	)
}
