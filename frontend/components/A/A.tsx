import Link from "next/link";
import { FC } from "react";


interface IProps{
    value?: any;
    href: string;
    className?: string;
    children?: any;
}

const A: FC<IProps> = ({value, href, className, children}) => {
    return (
        <Link href={href}>
            <a className={className}>{value ?? children}</a>
        </Link>
    );
};

export default A;