import { useState, useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import FlexBetween from '../../components/FlexBetween';
import Header from '../../components/Header';
import dayjs from 'dayjs';
import { api } from '../../services/axios';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  ptBR,
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

const Cities = () => {
  document.title = 'Início | IPJR';
  const theme = useTheme();
  const navigate = useNavigate();

  const [monthly, setMonthly] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    loadMonthly();
  };

  const loadMonthly = async () => {
    setIsLoading(true);
    const year = selectedDate.year();

    await api
      .get(`/researches/index?year=${year}`)
      .then((response) => {
        setMonthly(response.data);

        const rows = response.data.map((item) => {
          const row = { Cidade: item.id };

          item.data.forEach((month) => {
            row[month.x] = month.y;
          });

          return row;
        });

        setRows(rows);
        setColumns(
          Object.keys(rows[0]).map((key) => ({
            field: key,
            width: 150,
            renderCell: (params) => {
              const value = params.value;
              const id = params.row.Cidade;

              if (value === id) {
                return (
                  <Typography
                    sx={{
                      color: theme.palette.secondary[100],
                    }}
                  >
                    {value}
                  </Typography>
                );
              }

              if (value > 0) {
                return (
                  <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                    {value}%
                  </Typography>
                );
              }

              if (value < 0) {
                return (
                  <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                    {value}%
                  </Typography>
                );
              }

              return <Typography variant="body2">{value}%</Typography>;
            },
          }))
        );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadMonthly();
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween
        sx={{
          [theme.breakpoints.down('sm')]: {
            display: 'grid',
            gap: 3,
          },
        }}
      >
        <Header title="INÍCIO" subtitle="Bem vindo ao site do IPJR!" />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker views={['year']} label="Ano" value={selectedDate} onChange={(date) => handleDateChange(date)} />
        </LocalizationProvider>
      </FlexBetween>

      {isLoading ? (
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.primary[100],
            mt: '30%',
            textAlign: 'center',
          }}
        >
          Carregando...
        </Typography>
      ) : monthly.length > 0 ? (
        <>
          <Box mt="30px" borderRadius="0.55rem" p="1rem" backgroundColor={theme.palette.background.alt}>
            <Typography variant="h4" sx={{ color: theme.palette.secondary[100] }}>
              GRÁFICO IPJR - CIDADES
            </Typography>
          </Box>
          <Box height="70vh" mt={5} backgroundColor={theme.palette.background.alt} borderRadius="0.55rem">
            <ResponsiveLine
              data={monthly}
              loading={isLoading}
              onClick={(data) => {
                if (data.id) {
                  navigate(`/cidade/`, { state: { dataRef: selectedDate } });
                }
              }}
              theme={{
                axis: {
                  domain: {
                    line: {
                      stroke: theme.palette.secondary[100],
                    },
                  },
                  legend: {
                    text: {
                      fill: theme.palette.secondary[100],
                    },
                  },
                  ticks: {
                    line: {
                      stroke: theme.palette.secondary[100],
                      strokeWidth: 1,
                    },
                    text: {
                      fill: theme.palette.secondary[100],
                    },
                  },
                },
                grid: {
                  line: {
                    stroke: theme.palette.primary.light,
                    strokeWidth: 1,
                  },
                },
                dots: {
                  text: {
                    fill: theme.palette.secondary[200],
                  },
                },
                legends: {
                  text: {
                    fill: theme.palette.secondary[100],
                  },
                },
                tooltip: {
                  container: {
                    color: theme.palette.primary[300],
                  },
                },
              }}
              colors={{ scheme: 'category10' }}
              margin={{ top: 50, right: 150, bottom: 70, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false,
              }}
              curve="linear"
              yFormat={(value) => `${value}%`}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 90,
                legend: 'Mês',
                legendOffset: 60,
                legendPosition: 'middle',
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Índice',
                legendOffset: -50,
                legendPosition: 'middle',
              }}
              pointSize={10}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              useMesh={true}
              legends={[
                {
                  anchor: 'top-right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1,
                      },
                    },
                  ],
                  onClick: (data) => {
                    if (data.id) {
                      navigate(`/cidade/`, { state: { dataRef: selectedDate, cityRef: data.id } });
                    }
                  },
                },
              ]}
            />
          </Box>

          <Box
            mt="30px"
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: 'none',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.background.alt,
                color: theme.palette.secondary[100],
                borderBottom: 'none',
              },
              '& .MuiDataGrid-virtualScroller': {
                backgroundColor: theme.palette.primary.light,
              },
              '& .MuiDataGrid-toolbarContainer': {
                '& .MuiButton-root': {
                  color: theme.palette.secondary[100],
                },
              },
              '& .MuiDataGrid-footerContainer': {
                display: 'none',
              },
            }}
          >
            <DataGrid
              autoHeight
              rows={rows}
              columns={columns}
              slots={{ toolbar: CustomToolbar }}
              localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
              loading={isLoading}
              getRowId={(row) => row.Cidade}
            />
          </Box>
        </>
      ) : (
        <Typography
          variant="h2"
          sx={{
            color: theme.palette.error.main,
            mt: '30%',
            textAlign: 'center',
          }}
        >
          Não há dados suficientes para a apresentação do gráfico!
        </Typography>
      )}
    </Box>
  );
};

export default Cities;
