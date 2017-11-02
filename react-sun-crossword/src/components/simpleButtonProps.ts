export interface SimpleButtonProps {
    onClick?: React.EventHandler<React.MouseEvent<HTMLButtonElement>>
    text: string,
    disabled?: boolean
}