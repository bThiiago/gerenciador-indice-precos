import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, ArrowBackOutlined } from '@mui/icons-material';
import FlexBetween from './FlexBetween';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { asyncToggleTheme } from '../store/reducers/themeSlice';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  const navigate = useNavigate();

  return (
    <AppBar
      sx={{
        position: 'static',
        background: 'none',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackOutlined />
          </IconButton>
        </FlexBetween>
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(asyncToggleTheme())}>
            {darkMode ? (
              <LightModeOutlined sx={{ fontSize: '25px' }} />
            ) : (
              <DarkModeOutlined sx={{ fontSize: '25px' }} />
            )}
          </IconButton>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
