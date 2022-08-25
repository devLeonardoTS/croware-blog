import { OptStyles, StyleRecord } from "../@types/styling-types";

type StylingOptions = {
    default: StyleRecord;
    optional?: OptStyles<StyleRecord>;
}

export function StyleHandler(options: StylingOptions): StyleRecord {
    const styles: StyleRecord = options.default;

    if (!options.optional) {
        return styles;
    }

    const { optional } = options;

    if (optional.override) {
        Object.assign(styles, optional.override);

        /* 
            "styles" receive "defaultStyles".
            if "classes" is received the assign method will 
            check if "classes.container" has a value, if so, then,
            "styles.container" will receive "classes.container"'s value.

            this will happen to every property that has the same name
            within "styles" and "classes".
        */
    }

    if (optional.extend) {
        for (const item of Object.entries(optional.extend)) {
            const key: string = item[0];
            const value = styles[key];

            const newValue: string | undefined = item[1];

            const updatedValues = [value, newValue]
                .filter(v => typeof v === "string" && v.length > 0)
                .join(" ");

            styles[key] = updatedValues;
        }
    }

    return styles;

}