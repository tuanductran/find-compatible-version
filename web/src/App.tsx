import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { blue, cyan } from '@mui/material/colors'
import CompatibleVersion from './CompatibleVersion'

function App() {
  const theme = createTheme({
    palette: {
      primary: blue,
      secondary: cyan,
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CompatibleVersion />
    </ThemeProvider>
  )
}

export default App
