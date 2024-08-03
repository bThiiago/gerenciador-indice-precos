import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  ptBR,
} from '@mui/x-data-grid';
import FlexBetween from '../../components/FlexBetween';
import Header from '../../components/Header';
import { api } from '../../services/axios';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { ResponsiveLine } from '@nivo/line';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
    </GridToolbarContainer>
  );
}

const Category = () => {
  const location = useLocation();
  const path = decodeURIComponent(location.pathname.replace('/categoria/', ''));
  const categoryUrl = path.charAt(0).toUpperCase() + path.slice(1);

  document.title = `${categoryUrl} | IPJR`;
  const theme = useTheme();

  const [category, setCategory] = useState();

  const [monthly, setMonthly] = useState([]);
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const { dataRef, cityRef } = location.state || {};
  const [colorChart, setColorChart] = useState(null);

  const [selectedDate, setSelectedDate] = useState(dataRef ? dayjs().set('year', dataRef.$y) : dayjs());

  const chartColors = {
    100: '#1f77b4',
    101: '#ff7f0e',
    102: '#2ca02c',
    103: '#d62728',
    104: '#9467bd',
    105: '#8c564b',
    106: '#e377c2',
    107: '#7f7f7f',
    108: '#bcbd22',
    109: '#17becf',
  };

  const months = {
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro',
  };

  const fetchCategory = async () => {
    await api
      .get(`/categories/${path}`)
      .then((response) => {
        setCategory(response.data[0].id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const loadMonthly = async () => {
    setIsLoading(true);
    const year = selectedDate.year();

    await api
      .get(`/researches/index/city?year=${year}&city=${cityRef || 'Presidente Epitácio'}`)
      .then((response) => {
        const filteredData = response.data.filter((item) => item.id === categoryUrl);
        setMonthly(filteredData);
        if (!colorChart) {
          setColorChart(filteredData[0]?.color);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const loadProducts = async () => {
    setIsLoading(true);
    const year = selectedDate.year();

    await api
      .get(`/researches/index/product?year=${year}&category=${category}&city=${cityRef || 'Presidente Epitácio'}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCategory();
    loadMonthly();
    loadProducts();
  }, [selectedDate, path, category, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setMonthly([]);
    setProducts([]);
    loadMonthly();
    loadProducts();
  };

  const formatData = (data) => {
    const columns = [{ field: 'name', headerName: 'Produto', width: 200 }];
    const rows = {};

    data.forEach((item) => {
      const { name, month } = item;

      if (!columns[month]) {
        columns[month] = {
          field: month,
          headerName: `${months[month]}`,
          width: 150,
          type: 'number',
        };
      }

      if (!rows[name]) {
        rows[name] = {
          name,
          values: {},
        };
      }

      rows[name].values[month] = 'R$ ' + item.mean.toFixed(2).replace('.', ',');
    });

    const formattedRows = Object.values(rows).map((row) => {
      const { name, values } = row;

      return {
        name,
        ...values,
      };
    });

    return {
      columns: Object.values(columns),
      rows: formattedRows,
    };
  };

  const formatDataDiff = (data) => {
    const columnsDifference = [{ field: 'name', headerName: 'Produto', width: 200 }];
    const rowsDifference = {};

    data.forEach((item) => {
      if (item.difference === null) {
        return;
      }

      const { name, month } = item;

      if (!columnsDifference[month]) {
        columnsDifference[month] = {
          field: month,
          headerName: `${months[month]}`,
          width: 150,
          type: 'number',
          renderCell: (params) => {
            const value = params.value;

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
        };
      }

      if (!rowsDifference[name]) {
        rowsDifference[name] = {
          name,
          values: {},
        };
      }

      if (item.difference === null) {
        item.difference = 0;
      }
      rowsDifference[name].values[month] = item.difference;
    });

    const formattedRowsDifference = Object.values(rowsDifference).map((row) => {
      const { name, values } = row;

      return {
        name,
        ...values,
      };
    });

    return {
      columnsDifference: Object.values(columnsDifference),
      rowsDifference: formattedRowsDifference,
    };
  };

  const { columns, rows } = formatData(products);
  const { columnsDifference, rowsDifference } = formatDataDiff(products);

  useEffect(() => {
    setColorChart(null);
  }, [location.pathname]);

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
        <Header title={`IPJR-${categoryUrl}`} />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker views={['year']} label="Ano" value={selectedDate} onChange={(date) => handleDateChange(date)} />
        </LocalizationProvider>
      </FlexBetween>

      {monthly.length > 0 ? (
        <>
          <Box height="50vh" mt={5} backgroundColor={theme.palette.background.alt} borderRadius="0.55rem">
            <ResponsiveLine
              data={monthly}
              loading={isLoading}
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
                    fill: theme.palette.primary[100],
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
              colors={[`${chartColors[colorChart]}`]}
              margin={{ top: 50, right: 60, bottom: 70, left: 60 }}
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
              enablePointLabel={true}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              useMesh={true}
            />
          </Box>

          {category && (
            <>
              <Box mt="30px" borderRadius="0.55rem" p="1rem" backgroundColor={theme.palette.background.alt}>
                <Typography variant="h4" sx={{ color: theme.palette.secondary[100] }}>
                  ÍNDICES MENSAIS E VALORES MÉDIOS POR PRODUTO
                </Typography>
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
                  rows={rowsDifference}
                  columns={columnsDifference}
                  slots={{ toolbar: CustomToolbar }}
                  localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                  loading={isLoading}
                  getRowId={(row) => row.name}
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
                  getRowId={(row) => row.name}
                />
              </Box>
            </>
          )}
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

export default Category;
