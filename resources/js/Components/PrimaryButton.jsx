export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 bg-primary800 border border-transparent rounded-md font-semibold text-xs text-primary0 uppercase tracking-widest hover:bg-primary900 focus:bg-primary800 active:bg-gray-900 dark:active:bg-primary600 transition ease-in-out duration-150 ${
                    disabled && "opacity-25"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
