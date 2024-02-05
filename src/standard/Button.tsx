import React from "react"

export interface ButtonProps {
	type?: "button" | "reset" | "submit"
	small?: boolean
	colorTheme?: boolean
	style?: React.CSSProperties
	className?: string
	disabled?: boolean
	onClick?: () => void
	children: React.ReactNode // it's better a React.ReactNode
}

const Button = (props: ButtonProps) => {
	return (
		<button
			disabled={props.disabled}
			type={props.type ? props.type : "button"}
			className={`Button  ${props.small ? "Button--small" : ""} ${
				props.colorTheme ? "Button--theme" : ""
			} ${props.className ? props.className + " Button--custom" : ""} `}
			style={props.style}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	)
}

export default Button
