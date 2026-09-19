import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    children,
    ...props
}, ref) => {
    const baseClass = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;
    const fullWidthClass = fullWidth ? `btn--full` : '';

    const combinedClasses = [
        baseClass,
        variantClass,
        sizeClass,
        fullWidthClass,
        className
    ].filter(Boolean).join(' ');

    return (
        <button ref={ref} className={combinedClasses} {...props}>
            {children}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;