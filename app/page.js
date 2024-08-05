'use client';

import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { collection, doc, query, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '@/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const buttonStyles = {
  transition: 'all 0.3s ease', 
  '&:hover': {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', 
    transform: 'scale(1.05)',
  },
};

const backgroundStyle = {
  backgroundColor: '#EEA4BF',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='126' height='126' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='100' y1='33' x2='100' y2='-3'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='100' y1='135' x2='100' y2='97'%3E%3Cstop offset='0' stop-color='%23000' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%23000' stop-opacity='1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='%23cd86a1' %3E%3Crect x='100' width='100' height='100'/%3E%3Crect y='100' width='100' height='100'/%3E%3C/g%3E%3Cg %3E%3Cpolygon fill='url(%23a)' points='100 30 0 0 200 0'/%3E%3Cpolygon fill='url(%23b)' points='100 100 0 130 0 100 200 100 200 130'/%3E%3C/g%3E%3C/svg%3E")`,
   
};

export default function HomePage() {
  const [pantry, setPantry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updatePantry = async () => {
    try {
      const pantryQuery = query(collection(firestore, 'pantry'));
      const docs = await getDocs(pantryQuery);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push({ name: doc.id, ...doc.data() });
      });
      setPantry(pantryList);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const normalizedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'pantry'), normalizedItem);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const normalizedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'pantry'), normalizedItem);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { count } = docSnap.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
      await updatePantry();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const filteredPantry = pantry.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>
      </Box>
    );
  }

  return (
    <Box border={'1px solid #333'} paddingTop={4} sx={backgroundStyle}>
    <Box
      width="100%"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
      
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            ...buttonStyles,
          }}
        >
          Logout
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction={'row'} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
                sx={buttonStyles}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Box width="80%" paddingBottom={2}>
          <TextField
            id="search-bar"
            label="Search Items"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
'& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '5px',  // Thicker outline
        borderColor: 'white', // Solid black border
      },
      '& input': {
        fontSize: '1.2rem',  // Larger font size
        color:'white',
      },
    },
    '& .MuiInputLabel-root': {
      fontSize: '1.2rem',  // Larger label font size
      color:'#6495ED',
    },
            }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={buttonStyles}
        >
          Add
        </Button>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display="flex"
          justifyContent="center"
          alignItems="center"
          border="1px solid #333"
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" spacing={2} overflow="auto">
          {filteredPantry.map(({ name, count }) => (
            <Box
              key={name}
              minHeight="150px"
              width="100%"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              padding={2}
              bgcolor={'#f0f0f0'}
              border="1px solid #ddd"
              borderRadius="8px"
            >
              <Typography variant="h3" color="#333" textAlign="center" fontWeight="bold">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {count}
              </Typography>
              <Button
                variant="contained"
                onClick={() => removeItem(name)}
                sx={buttonStyles}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
