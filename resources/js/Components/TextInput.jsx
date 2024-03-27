import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                "border-primary500 bg-primary100  text-primary900 focus:border-primary900 focus:ring-primary900 rounded-md shadow-sm " +
                className
            }
            ref={input}
        />
    );
});
