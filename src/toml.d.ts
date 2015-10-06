declare namespace toml {
    function parse(string): Object;
}

declare module 'toml' {
    export = toml;
}
