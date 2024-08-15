import { useState } from 'react';
import { findMatchingVersion } from 'find-compatible-version';
import { Button, TextField, Typography, Container, Box } from '@mui/material';

function App() {
  const [upperPackage, setUpperPackage] = useState<string>('');
  const [startingVersion, setStartingVersion] = useState<string>('');
  const [subDependency, setSubDependency] = useState<string>('');
  const [targetSubDepVersion, setTargetSubDepVersion] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await findMatchingVersion(upperPackage, startingVersion, subDependency, targetSubDepVersion)
  };

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
        <Typography variant="h4" gutterBottom>
          Find NPM Package Version
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField 
            fullWidth 
            label="Upper Package" 
            variant="outlined" 
            value={upperPackage} 
            onChange={(e) => setUpperPackage(e.target.value)} 
            margin="normal" 
            required
            autoComplete="off"
          />
          <TextField 
            fullWidth 
            label="Starting Version" 
            variant="outlined" 
            value={startingVersion} 
            onChange={(e) => setStartingVersion(e.target.value)}
            margin="normal"
            required
            autoComplete="off"
          />
          <TextField 
            fullWidth 
            label="Sub Dependency" 
            variant="outlined" 
            value={subDependency} 
            onChange={(e) => setSubDependency(e.target.value)} 
            margin="normal" 
            required 
            autoComplete="off"
          />
          <TextField 
            fullWidth 
            label="Target Sub Dependency Version" 
            variant="outlined" 
            value={targetSubDepVersion} 
            onChange={(e) => setTargetSubDepVersion(e.target.value)} 
            margin="normal" 
            required 
            autoComplete="off"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ marginTop: 2 }}
          >
            Search
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default App;