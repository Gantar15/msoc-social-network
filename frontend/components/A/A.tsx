import Link from "next/link";
import { FC, ReactElement } from "react";


type elementContent = ReactElement | ReactElement[];
interface IProps{
    value?: elementContent;
    href: string;
    className?: string;
    children?: elementContent;
}

const A: FC<IProps> = ({value, href, className, children}) => {
    return (
        <Link href={href}>
            <a className={className}>{value ?? children}</a>
        </Link>
    );
};

export default A;