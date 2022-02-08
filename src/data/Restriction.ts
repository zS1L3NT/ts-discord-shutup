export default interface Restriction {
	id: string
	user_id: string
	message: string
	expires: number | null
}
