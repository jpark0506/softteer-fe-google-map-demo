import './container.css'
type Props = {
    children: React.ReactNode;
}

const RootContainer = (props: Props) => {

    const { children }= props;
    return (
        <div className="root-container">
            {children}
        </div>
    )
}

export default RootContainer