

export default function TextLink({color='blue', ...props}) {
    return (
        <a href={props.href} 
        class={`relative inline-block text-barokah-300 hover:text-barokah-400 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-barokah-400 after:transition-all after:duration-500 after:ease-in-out hover:after:w-full`}>
            {props.text}
        </a>
    )
}