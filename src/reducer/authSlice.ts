import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { IAuth } from "../data/type"

const initialState: IAuth = {
	userId: "",
	email: "",
	name: "",
	avatar: "",
	isAuthenticated: false,
}

export const AuthSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IAuth>) => {
			return { ...action.payload }
		},
		resetUser: (state) => {
			return {
				...initialState,
			}
		},
	},
})

export const { setUser, resetUser } = AuthSlice.actions

export default AuthSlice.reducer
