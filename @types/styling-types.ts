export type OptStyles<T> = {
    override?: T;
    extend?: T;
}

export type StyleRecord = Record<string, string | undefined>;