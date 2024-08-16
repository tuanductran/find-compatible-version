import type { FormEvent } from 'react'
import { useState } from 'react'
import { findMatchingVersion } from 'find-compatible-version'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import toast from 'react-hot-toast'

function CompatibleVersion() {
  const [dependency, setDependency] = useState<string>('')
  const [dependencyVersion, setDependencyVersion] = useState<string>('')
  const [subDependency, setSubDependency] = useState<string>('')
  const [subDepVersion, setSubDepVersion] = useState<string>('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const data = findMatchingVersion(dependency, dependencyVersion, subDependency, subDepVersion)

    toast.promise(data, {
      loading: 'Fetching compatible version...',
      success: 'Successfully retrieved data!',
      error: 'An error occurred while fetching data.',
    })
  }

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Typography variant="h4" component="h1" sx={{ mb: 3, color: 'text.primary' }}>
          Find Compatible Version
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Dependency"
            placeholder="e.g: express"
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
            placeholder="e.g: 4.19.2"
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
            placeholder="e.g: body-parser"
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
            placeholder="e.g: 1.20.2"
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
            sx={{ mt: 2, borderRadius: 20 }}
          >
            Search for Compatible
          </Button>
        </form>
      </Box>
    </Container>
  )
}

export default CompatibleVersion
