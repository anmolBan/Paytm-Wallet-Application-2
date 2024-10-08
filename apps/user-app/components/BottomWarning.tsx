import Link from "next/link";

export function BottomWarning({label, buttonText, to}: any){
    return(
        <div className="py-2 text-sm flex justify-center">
            <div>
                {label}
            </div>
            <Link className="pointer underline pl-1 cursor-pointer" href={to}>
                {buttonText}
            </Link>
        </div>
    )
}