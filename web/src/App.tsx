import { useState } from 'react'
import { findMatchingVersion } from 'find-compatible-version'
import { Box, Button, Container, TextField, Typography } from '@mui/material'

function App() {
  const [dependency, setDependency] = useState<string>('')
  const [dependencyVersion, setDependencyVersion] = useState<string>('')
  const [subDependency, setSubDependency] = useState<string>('')
  const [subDepVersion, setSubDepVersion] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await findMatchingVersion(dependency, dependencyVersion, subDependency, subDepVersion)
  }

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Find Compatible Version
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Dependency"
            variant="outlined"
            value={dependency}
            onChange={e => setDependency(e.target.value)}
            margin="normal"
            required
            autoComplete="off"
            inputProps={{ 'aria-label': 'Dependency' }}
          />
          <TextField
            fullWidth
            label="Dependency Version"
            variant="outlined"
            value={dependencyVersion}
            onChange={e => setDependencyVersion(e.target.value)}
            margin="normal"
            required
            autoComplete="off"
            inputProps={{ 'aria-label': 'Dependency Version' }}
          />
          <TextField
            fullWidth
            label="Sub Dependency"
            variant="outlined"
            value={subDependency}
            onChange={e => setSubDependency(e.target.value)}
            margin="normal"
            required
            autoComplete="off"
            inputProps={{ 'aria-label': 'Sub Dependency' }}
          />
          <TextField
            fullWidth
            label="Sub Dependency Version"
            variant="outlined"
            value={subDepVersion}
            onChange={e => setSubDepVersion(e.target.value)}
            margin="normal"
            required
            autoComplete="off"
            inputProps={{ 'aria-label': 'Sub Dependency Version' }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Search
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default App
