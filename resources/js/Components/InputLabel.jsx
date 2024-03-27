export default function InputLabel({
    value,
    className = "",
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`block font-medium text-sm text-primary900 ` + className}
        >
            {value ? value : children}
        </label>
    );
}
