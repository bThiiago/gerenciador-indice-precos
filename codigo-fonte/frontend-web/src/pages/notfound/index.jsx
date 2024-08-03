import { ChevronLeft } from "@mui/icons-material";
import { Button, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  document.title = "Página não encontrada";
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      m="1.5rem 2.5rem"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      mt="30%"
    >
      <Typography variant="h1" align="center">
        404
      </Typography>
      <Typography variant="h2" align="center">
        Página não encontrada
      </Typography>
      <Button
        variant="contained"
        sx={{
          mt: "1rem",
          borderRadius: "2rem",
          backgroundColor: theme.palette.secondary[200],
          color: theme.palette.secondary[100],
        }}
        startIcon={<ChevronLeft />}
        onClick={() => navigate("/")}
      >
        Voltar para a página inicial
      </Button>
    </Box>
  );
};

export default NotFound;
