'use client';

import { Box, Typography, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase'; // Adjust the path as necessary

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      gap={2}
      sx={{
        backgroundImage: 'url(/woodbackground.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      
    >
      <Box
        width="400px"
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        border="1px solid #ddd"
        borderRadius="8px"
        boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
        sx={{
          animation: 'slideUp 1s ease-out', // Apply the slide-up animation
        }}
      >
        <Typography variant="h4" mb={2} sx={{ color: 'white' }}>Login</Typography>
        {error && (
          <Typography variant="body1" color="error" mb={2}>
            {error}
          </Typography>
        )}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;