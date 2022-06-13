type Props = {
    name: string,
    size?: number,
    class?: string,
    alt?: string,
}
export default function(props: Props) {
    if (!props.class) props.class = 'icon';
    else props.class += ' icon';

    props.size ??= 24;

    return (
        <svg
            className={props.class}
            width={props.size}
            height={props.size}

            // Accessibility
            {...(props.alt ? ({
                role: "img",
                "aria-label": props.alt
            }): {
                "aria-hidden": true,
                focusable: false
            })}

            // Special for Feather Icons
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <use href={"/assets/icons.sprite.svg#" + props.name } />
        </svg>
    )
}
