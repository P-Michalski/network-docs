import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html {
        box-sizing: border-box;
    }

    *,
    ::after,
    ::before {
        box-sizing: inherit;
    }

    body {
        background-color: #eeeeee;
        word-break: break-all;
        font-family: 'Montserrat', sans-serif;
    }
`;