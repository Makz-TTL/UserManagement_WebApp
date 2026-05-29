type InputProps = {
    count: number
}

const Counter = (props: InputProps) => {
    return (
        <span> Count: {props.count} </span>
    )
}

export default Counter