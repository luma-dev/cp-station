import { LocaleProvider } from '@hi18n/react';
import { common, purple } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createPostpathClient } from '@swingride/client-postpath';
import { PostpathClientProvider } from '@swingride/client-postpath-react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewFolder from './apps/new-folder/page';
import Root from './apps/page';

const queryClient = new QueryClient();
const postpathClient = createPostpathClient({
  httpBasePath: 'http://space:8052',
  debug: {
    printErrorInConsole: true,
    // delayBeforeSendMs: 400,
  },
});

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: '#f44336',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 8,
        },
        tooltipPlacementBottom: { marginTop: '4px !important' },
        tooltipPlacementTop: { marginBottom: '4px !important' },
        popper: {
          pointerEvents: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 'unset',
          borderRadius: 0,
        },
      },
      variants: [
        {
          props: { variant: 'dashed' },
          style: {
            textTransform: 'none',
            border: `4px dashed ${common.black}`,
          },
        },
      ],
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <PostpathClientProvider client={postpathClient}>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <LocaleProvider locales="ja">
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Root />}>
                    <Route index />
                    <Route path="/new-folder" element={<NewFolder />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </LocaleProvider>
          </ThemeProvider>
        </PostpathClientProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
