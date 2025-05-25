import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    *,
    ::after,
    ::before {
        box-sizing: inherit;
    }

    body {
        background-color: #eeeeee;
        word-break: break-all;
        margin: 0;
        padding: 0;
    }
`;