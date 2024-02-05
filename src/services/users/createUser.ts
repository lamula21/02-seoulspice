import { doc, setDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { IAuth } from "../../data/type"

/**
 * Create a new user in the firestore database
 * @param user - The user object to be created
 */
export async function createUser(user: IAuth) {
	// setDoc - sets data of existing document or creates a new document
	const res = await setDoc(doc(db, "users", user.email!), {
		...user,
	})

	return res
}
