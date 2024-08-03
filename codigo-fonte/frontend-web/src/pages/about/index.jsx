import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import Header from "../../components/Header";
import FlexBetween from "../../components/FlexBetween";

const About = () => {
  document.title = "Sobre";
  const theme = useTheme();

  const person1 = {
    name: "João Pedro de França Lourenço",
    email: "joao.franca@aluno.ifsp.edu.br",
    github: "https://github.com/zFranca1",
    avatar: "https://github.com/zFranca1.png",
  };

  const person2 = {
    name: "Thiago Bruchmann Carnaiba",
    email: "thiago.bruchmann@aluno.ifsp.edu.br",
    github: "https://github.com/bThiiago",
    avatar: "https://github.com/bThiiago.png",
  };

  const person3 = {
    name: "Andrea Padovan Jubileu",
    email: "andreapjubileu@ifsp.edu.br",
    avatar: "https://github.com/generic-user-name.png",
  };

  const person4 = {
    name: "Claudio Maximiliano Zaina ",
    email: "claudio.zaina@ifsp.edu.br",
    avatar: "https://github.com/generic-user-name.png",
  };

  return (
    <>
      <Box m="1.5rem 2.5rem">
        <FlexBetween
          sx={{
            [theme.breakpoints.down("sm")]: {
              display: "grid",
              gap: 3,
            },
          }}
        >
          <Header
            title="SOBRE"
            subtitle="Informações dos envolvidos no projeto"
          />
        </FlexBetween>
        <Box
          mt="30px"
          borderRadius="0.55rem"
          p="1rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Typography variant="h4" sx={{ color: theme.palette.secondary[100] }}>
            DESENVOLVEDORES
          </Typography>
        </Box>
        <Box
          m="1.5rem 0rem"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <FlexBetween
            sx={{
              [theme.breakpoints.down("md")]: {
                display: "grid",
                gap: 3,
              },
              display: "flex",
              gap: 3,
            }}
          >
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "0.55rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "300px",
                }}
                backgroundColor={theme.palette.background.alt}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: 151,
                    borderRadius: "50%",
                    alignSelf: "center",
                    mt: "1rem",
                  }}
                  image={person1.avatar}
                  alt="Franca"
                />
                <CardContent sx={{ flex: "1 0 auto", alignSelf: "center" }}>
                  <Typography variant="h6">{person1.name}</Typography>
                  <Typography mt={1} mb={1} variant="body1">
                    {person1.email}
                  </Typography>
                  <Link
                    href={person1.github}
                    target="_blank"
                    rel="noopener"
                    color={theme.palette.secondary[100]}
                  >
                    Link para o GitHub
                  </Link>
                </CardContent>
              </Box>
            </Card>

            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: "0.55rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "300px",
                }}
                backgroundColor={theme.palette.background.alt}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: 151,
                    borderRadius: "50%",
                    alignSelf: "center",
                    mt: "1rem",
                  }}
                  image={person2.avatar}
                  
                  alt="Bruch"
                />
                <CardContent sx={{ flex: "1 0 auto", alignSelf: "center" }}>
                  <Typography variant="h6">{person2.name}</Typography>
                  <Typography mt={1} mb={1} variant="body1">
                    {person2.email}
                  </Typography>
                  <Link
                    href={person2.github}
                    target="_blank"
                    rel="noopener"
                    color={theme.palette.secondary[100]}
                  >
                    Link para o GitHub
                  </Link>
                </CardContent>
              </Box>
            </Card>
          </FlexBetween>
        </Box>
      </Box>
    </>
  );
};

export default About;
