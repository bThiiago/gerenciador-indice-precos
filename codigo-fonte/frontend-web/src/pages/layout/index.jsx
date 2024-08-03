import { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    isNonMobile ? true : false,
  );

  return (
    <Box display="block" width="100%" height="100%">
      <Box>
        <Sidebar
          isNonMobile={isNonMobile}
          drawerWidth="270px"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </Box>
      <Box
        flexGrow={1}
        marginLeft={isSidebarOpen && isNonMobile ? "270px" : "0px"}
      >
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
