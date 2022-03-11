interface Props
{
    show: boolean;
}

export default ( props: Props ) =>
{
    return props.show ? <div className="loader"></div> : <></>;
}